import { initState } from "./state-management";
import { type BrandString, BetterRecord } from "./type-util";
import { type RecordOf, List } from "immutable";

export const makePlayerStatus = BetterRecord<PlayerStatusProps, "currentTrack">(
  {
    state: "pause",
    volume: 0,
    trackPosition: 0,
    currentTrack: undefined,
  }
);

export const makeDisconnectedState = BetterRecord<DisconnectedStateProps>({
  websocketStatus: "disconnected",
  pendingIntents: List(),
  player: undefined,
  failureAt: undefined,
});

export const makeConnectedState = BetterRecord<ConnectedStateProps, "ws">({
  websocketStatus: "connected",
  pendingIntents: List(),
  sentIntents: List(),
  responseData: "",
  player: undefined,
  ws: undefined,
});

export const makeConnectingState = BetterRecord<ConnectingStateProps, "ws">({
  websocketStatus: "connecting",
  pendingIntents: List(),
  player: undefined,
  ws: undefined,
});

export const { createHandler, subscribe, unsubscribe } = initState<State>(
  makeDisconnectedState({})
);

export type State = ConnectedState | DisconnectedState | ConnectingState;

type BaseStateProps = {
  player?: PlayerStatus;
  pendingIntents: List<UserIntent>;
};

export type ConnectedStateProps = BaseStateProps & {
  websocketStatus: "connected";
  sentIntents: List<UserIntent>;
  responseData: string;
  ws: WebSocket;
};
export type ConnectedState = RecordOf<ConnectedStateProps>;

type DisconnectedStateProps = BaseStateProps & {
  websocketStatus: "disconnected";
  failureAt?: Date;
};
export type DisconnectedState = RecordOf<DisconnectedStateProps>;

export type ConnectingStateProps = BaseStateProps & {
  websocketStatus: "connecting";
  ws: WebSocket;
};
export type ConnectingState = RecordOf<ConnectingStateProps>;

export type Song = Readonly<{
  file: SongId;
  title?: string;
  artist?: string;
  album?: string;
  trackNo?: string;
  duration?: number;
}>;

export type PlayerStatusProps = {
  state: "pause" | "stop" | "play";
  volume: number;
  trackPosition: number;
  currentTrack: SongId;
};
export type PlayerStatus = RecordOf<PlayerStatusProps>;

export type UserIntent = Readonly<
  | { type: "pause" }
  | { type: "stop" }
  | { type: "next_track" }
  | { type: "previous_track" }
  | { type: "set_volume"; volume: number }
>;

export type SongId = BrandString<"SongId">;

type Handler<T extends unknown[]> = (...t: T) => void;
export const makeIntentHandler = <T extends unknown[]>(
  makeIntent: (...args: T) => UserIntent
): Handler<T> =>
  createHandler((s, ...args) => {
    const intent = makeIntent(...args);
    // We need the switch to make typescript happy
    switch (s.websocketStatus) {
      case "connected":
        return s.update("pendingIntents", (intents) => intents.push(intent));
      case "disconnected":
        return s.update("pendingIntents", (intents) => intents.push(intent));
      case "connecting":
        return s.update("pendingIntents", (intents) => intents.push(intent));
    }
  });

const tick = createHandler((state) => state);
setInterval(tick, 1000);
