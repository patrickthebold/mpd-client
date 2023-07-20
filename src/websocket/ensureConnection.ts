import { type State } from "../state";
import { type Consumer } from "../types";
import { createHandler, makeConnectingState } from "../state";

const WS_URL = "ws://localhost:8080"
let ws: Websocket

const setConnecting = createHandler((state) => makeConnectingState(state).remove('websocketStatus'))
const setDisconnected = createHandler((state) => makeConnectingState(state).remove('websocketStatus'))

export const ensureConnection: Consumer<State> = (state) => {
    if (state.websocketStatus === 'disconnected') {
        ws = new WebSocket(WS_URL);
        ws,addEventListener('close', )
    }

}