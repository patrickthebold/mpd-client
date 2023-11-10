import { initState } from "./state-management";
import { type BrandString, BetterRecord } from "./type-util";
import { type RecordOf, List } from "immutable";
import { makeConfigurable } from "./util";
import { type MpdCommand, type UserIntent } from "./intents";

export const makePlayerStatus = BetterRecord<
  PlayerStatusProps,
  keyof PlayerStatusProps
>({
  state: undefined,
  volume: undefined,
  trackPosition: undefined,
  currentTrack: undefined,
});

export const makeDisconnectedState = BetterRecord<DisconnectedStateProps>({
  websocketStatus: "disconnected",
  pendingIntents: List(),
  player: undefined,
  failureAt: undefined,
  ws: undefined,
});

export const makeConnectedState = BetterRecord<ConnectedStateProps, "ws">({
  websocketStatus: "connected",
  pendingIntents: List(),
  sentCommands: List(),
  responseData: List(),
  q: List(),
  isCommandList: false,
  player: undefined,
  ws: undefined,
});

export const makeConnectingState = BetterRecord<ConnectingStateProps, "ws">({
  websocketStatus: "connecting",
  pendingIntents: List(),
  player: undefined,
  ws: undefined,
});

const { createHandler: baseCreateHandler, subscribe: baseSubscribe } =
  initState<State>(makeDisconnectedState());

export const createHandler = makeConfigurable(baseCreateHandler);
export const subscribe = makeConfigurable(baseSubscribe);

export type State = ConnectedState | DisconnectedState | ConnectingState;

type BaseStateProps = {
  player?: PlayerStatus;
  pendingIntents: List<UserIntent>;
};

export type ConnectedStateProps = BaseStateProps & {
  websocketStatus: "connected";
  sentCommands: List<MpdCommand>;
  isCommandList: boolean;
  responseData: List<string>;
  ws: WebSocket;
  q: List<Song>;
};
export type ConnectedState = RecordOf<ConnectedStateProps>;

type DisconnectedStateProps = BaseStateProps & {
  websocketStatus: "disconnected";
  failureAt?: Date;
  ws?: WebSocket; // optionally old websocket because we need to clean up event listeners.
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
  currentTrack: number;
};
export type PlayerStatus = RecordOf<PlayerStatusProps>;

export type SongId = BrandString<"SongId">;
