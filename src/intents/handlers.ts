import { createHandler } from "../state";
import type { Handler } from "../types";
import type { UserIntent } from "./types";

const makeIntentHandler = <T extends unknown[]>(
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
