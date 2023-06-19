import { BrandString } from "./type-util";
import { RecordOf, List } from 'immutable';

export type State = ConnectedState | DisconnectedState | ConnectingState;

export type ConnectedState = RecordOf<{
    websocket: 'connected';
    player: PlayerStatus;
    sentIntents: List<UserIntent>;
    pendingIntents: List<UserIntent>;
    responseData: string;
}>

export type DisconnectedState = RecordOf<{
    websocket: 'disconnected';
    pendingIntents: List<UserIntent>;
}>
export type ConnectingState = RecordOf<{
    websocket: 'connecting';
    pendingIntents: List<UserIntent>;
}>

export type Song = Readonly<{
    file: SongId;
    title?: string;
    artist?: string;
    album?: string;
    trackNo?: string;
    duration?: number;
}>

export type PlayerStatus = RecordOf<{
    state: 'pause' | 'stop' | 'play';
    volume: number;
    trackPosition: number;
    currentTrack: SongId
}>

export type UserIntent = Readonly<{type: 'pause'} | {type: 'stop'} | {type: 'next_track'} | {type: 'previous_track'} | {type: 'set_volume', volume: number}>

export type SongId = BrandString<'SongId'>
