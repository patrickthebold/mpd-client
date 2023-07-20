import { initState } from "./state-management";
import { type BrandString } from "./type-util";
import { type RecordOf, List, Record } from "immutable";

const makeDisconnectedState: Record.Factory<DisconnectedStateProps> = Record({
  websocketStatus: "disconnected",
  pendingIntents: List(),
});

export const { createHandler, subscribe, unsubscribe } = initState<State>(
  makeDisconnectedState()
);

export type State = ConnectedState | DisconnectedState | ConnectingState;

type BaseStateProps = {
  player?: PlayerStatus;
  pendingIntents: List<UserIntent>;
};

export type ConnectedState = RecordOf<
  BaseStateProps & {
    websocketStatus: "connected";
    sentIntents: List<UserIntent>;
    responseData: string;
  }
>;

type DisconnectedStateProps = BaseStateProps & {
  websocketStatus: "disconnected";
  failure?: RecordOf<{ time: Date; count: number }>;
};
export type DisconnectedState = RecordOf<DisconnectedStateProps>;

export type ConnectingState = RecordOf<
  BaseStateProps & {
    websocketStatus: "connecting";
  }
>;

export type Song = Readonly<{
  file: SongId;
  title?: string;
  artist?: string;
  album?: string;
  trackNo?: string;
  duration?: number;
}>;

export type PlayerStatus = RecordOf<{
  state: "pause" | "stop" | "play";
  volume: number;
  trackPosition: number;
  currentTrack: SongId;
}>;

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
