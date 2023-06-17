import { BrandString } from "./type-util";

export type State = {
    status: PlayStatus;
    sentCommands: MpdCommand[];
    desiredCommands: MpdCommand[];
    responseData: string;
}

export type Song = {
    file: SongId;
    title?: string;
    artist?: string;
    album?: string;
    trackNo?: string;
    duration?: number;
}

export type PlayStatus = {
    state: 'pause' | 'stop' | 'play';
    volume: number;
    trackPosition: number;
    currentTrack: SongId
}

// This is not literally what get's sent on the websocket, just a representation of
// something we need to tell the server.
export type MpdCommand = {type: 'pause'} | {type: 'stop'} | {type: 'next_track'} | {type: 'previous_track'} | {type: 'set_volume', volume: number}

export type SongId = BrandString<'SongId'>
