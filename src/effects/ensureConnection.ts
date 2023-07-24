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

const handleMessage = createHandler((state, e: MessageEvent) => {
  if (state.websocketStatus !== "connected") {
    console.error("Got a message when not connected");
    return state;
  }
  const probablyText = e.data;
  if (typeof probablyText === "string") {
    return state.update("responseData", (response) =>
      response.push(...probablyText.split("\n"))
    );
  }
  console.warn("We did not get a string over the websocket");
  return state;
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
    ws.addEventListener("message", handleMessage);
    return makeConnectingState({
      ...state.toObject(),
      websocketStatus: "connecting",
      ws,
    });
  }
  return state;
};

export const removeWsListeners: Effect = (state) => {
  if (state.websocketStatus === "disconnected" && state.ws) {
    state.ws.removeEventListener("close", setDisconnected);
    state.ws.removeEventListener("open", setConnected);
    state.ws.removeEventListener("error", setDisconnected);
    state.ws.removeEventListener("message", handleMessage);
    state.remove("ws");
  }
  return state;
};
