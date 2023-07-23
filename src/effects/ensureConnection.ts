import {
  type DisconnectedState,
  makeConnectedState,
  type State,
} from "../state";
import {
  createHandler,
  makeConnectingState,
  makeDisconnectedState,
} from "../state";
import { type Effect } from "./types";

const WS_URL = "ws://localhost:8080";
const RECONNECT_MS = 2000;

const getDisconnectedState = (state: State): DisconnectedState =>
  makeDisconnectedState({
    ...state.toObject(),
    websocketStatus: "disconnected",
    failureAt: new Date(),
  });

const setDisconnected = createHandler((state) => {
  if (state.websocketStatus === "disconnected") {
    console.error("disconnecting when already disconnected");
    return state;
  } else {
    return getDisconnectedState(state);
  }
});

const setConnected = createHandler((state) => {
  if (state.websocketStatus === "connecting") {
    return makeConnectedState({
      ...state.toObject(),
      websocketStatus: "connected",
    });
  } else {
    console.error('unexpected "open" event! Setting state as disconnected');
    return getDisconnectedState(state);
  }
});

export const ensureConnection: Effect = (state) => {
  if (
    state.websocketStatus === "disconnected" &&
    state.ws === undefined &&
    (state.failureAt === undefined ||
      state.failureAt.getTime() < Date.now() - RECONNECT_MS)
  ) {
    const ws = new WebSocket(WS_URL);
    ws.addEventListener("close", setDisconnected);
    ws.addEventListener("open", setConnected);
    ws.addEventListener("error", setDisconnected);
    return makeConnectingState({
      ...state.toObject(),
      websocketStatus: "connecting",
      ws,
    });
  }
  return state;
};

export const removeEventListener: Effect = (state) => {
  if (state.websocketStatus === "disconnected" && state.ws) {
    state.ws.removeEventListener("close", setDisconnected);
    state.ws.removeEventListener("open", setConnected);
    state.ws.removeEventListener("error", setDisconnected);
    state.remove("ws");
  }
  return state;
};
