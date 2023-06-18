import { BrandString } from "./type-util";

export type State = ConnectedState | DisconnectedState | ConnectingState;

export type ConnectedState = {
    websocket: 'connected';
    player: PlayerStatus;
    sentIntents: UserIntent[];
    pendingIntents: UserIntent[];
    responseData: string;
}

export type DisconnectedState = {
    websocket: 'disconnected';
    pendingIntents: UserIntent[];
}
export type ConnectingState = {
    websocket: 'connecting';
    pendingIntents: UserIntent[];
}

export type Song = {
    file: SongId;
    title?: string;
    artist?: string;
    album?: string;
    trackNo?: string;
    duration?: number;
}

export type PlayerStatus = {
    state: 'pause' | 'stop' | 'play';
    volume: number;
    trackPosition: number;
    currentTrack: SongId
}

export type UserIntent = {type: 'pause'} | {type: 'stop'} | {type: 'next_track'} | {type: 'previous_track'} | {type: 'set_volume', volume: number}

export type SongId = BrandString<'SongId'>
