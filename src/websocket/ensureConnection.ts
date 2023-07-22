import {
  type DisconnectedState,
  makeConnectedState,
  type State,
} from "../state";
import { type Consumer } from "../types";
import {
  createHandler,
  makeConnectingState,
  makeDisconnectedState,
} from "../state";

const WS_URL = "ws://localhost:8080";
const RECONNECT_MS = 2000;

const setConnecting = createHandler((state, ws: WebSocket) =>
  makeConnectingState({
    ...state.toObject(),
    websocketStatus: "connecting",
    ws,
  })
);

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
    state.ws.removeEventListener("close", setDisconnected);
    state.ws.removeEventListener("open", setConnected);
    state.ws.removeEventListener("error", setDisconnected);
    return getDisconnectedState(state);
  }
});
const setConnected = createHandler((state) => {
  if (state.websocketStatus === "connected") {
    return makeConnectedState({
      ...state.toObject(),
      websocketStatus: "connected",
    });
  } else {
    console.error('unexpected "open" event! Setting state as disconnected');
    return getDisconnectedState(state);
  }
});

export const ensureConnection: Consumer<State> = (state) => {
  if (
    state.websocketStatus === "disconnected" &&
    (state.failureAt === undefined ||
      state.failureAt.getTime() < Date.now() - RECONNECT_MS)
  ) {
    const ws = new WebSocket(WS_URL);
    setConnecting(ws);
    ws.addEventListener("close", setDisconnected);
    ws.addEventListener("open", setConnected);
    ws.addEventListener("error", setDisconnected);
  }
};
