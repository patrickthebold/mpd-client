import { BrandString } from "./type-util";

export type SongId = BrandString<'SongId'>

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
