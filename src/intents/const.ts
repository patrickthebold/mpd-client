import { type UserIntent } from "./types";

export const pause: UserIntent = { type: "pause" };
export const stop: UserIntent = { type: "stop" };
export const nextTrack: UserIntent = { type: "next_track" };
export const prevTrack: UserIntent = { type: "previous_track" };
export const setVolume = (volume: number): UserIntent => ({
  type: "set_volume",
  volume,
});
export const idle = (canceled: boolean): UserIntent => ({
  type: "idle",
  canceled,
});
export const getQ: UserIntent = { type: "get_q" };
export const status: UserIntent = { type: "status" };
