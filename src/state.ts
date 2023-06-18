import { BrandString } from "./type-util";

export type State = {
    player: PlayerStatus;
    sentIntents: UserIntent[];
    pendingIntents: UserIntent[];
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

export type PlayerStatus = {
    state: 'pause' | 'stop' | 'play';
    volume: number;
    trackPosition: number;
    currentTrack: SongId
}

export type UserIntent = {type: 'pause'} | {type: 'stop'} | {type: 'next_track'} | {type: 'previous_track'} | {type: 'set_volume', volume: number}

export type SongId = BrandString<'SongId'>
