import { currentTime } from "../coeffects";
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

const createHandlerWithTime = createHandler.with(currentTime());

const getDisconnectedState = (state: State, now: Date): DisconnectedState =>
  makeDisconnectedState({
    ...state.toObject(),
    websocketStatus: "disconnected",
    failureAt: now,
  });

const setDisconnected = createHandlerWithTime((state, now) => {
  if (state.websocketStatus === "disconnected") {
    console.error("disconnecting when already disconnected");
    return state;
  } else {
    return getDisconnectedState(state, now);
  }
});

const setConnected = createHandlerWithTime((state, now) => {
  if (state.websocketStatus === "connecting") {
    return makeConnectedState({
      ...state.toObject(),
      websocketStatus: "connected",
    });
  } else {
    console.error('unexpected "open" event! Setting state as disconnected');
    return getDisconnectedState(state, now);
  }
});

const handleMessage = createHandler((state, e: MessageEvent) => {
  if (state.websocketStatus !== "connected") {
    console.error("Got a message when not connected");
    return state;
  }
  const probablyText = e.data;
  if (typeof probablyText === "string") {
    // Little dance so that responseData is split on new lines.
    return state.update("responseData", (response) => {
      const [head, ...tail] = probablyText.split("\n");
      const newLast = response.last("") + head;
      return response.butLast().push(newLast, ...tail);
    });
  }
  console.warn("We did not get a string over the websocket");
  return state;
});

export const ensureConnection: Effect = (state, now) => {
  if (
    state.websocketStatus === "disconnected" &&
    state.ws === undefined &&
    (state.failureAt === undefined ||
      state.failureAt.getTime() < now.getTime() - RECONNECT_MS)
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
