import { makeIntentHandler } from "../state";

export const pause = makeIntentHandler(() => ({ type: "pause" }));
export const stop = makeIntentHandler(() => ({ type: "stop" }));
export const nextTrack = makeIntentHandler(() => ({ type: "next_track" }));
export const previousTrack = makeIntentHandler(() => ({
  type: "previous_track",
}));
export const setVolume = makeIntentHandler((volume: number) => ({
  type: "set_volume",
  volume,
}));
