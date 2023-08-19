import { time } from "../coeffects/time";
import { type State, createHandler, subscribe } from "../state";
import { skipDuplicates, perTick } from "../transformers";
import { ensureConnection, removeWsListeners } from "./ensureConnection";
import { type Effect } from "./types";

/**
 * Effects will observe state changes. The must return a different value for the state if
 * they actually perform a side effect. All side effects should happen here. Typically they will
 * do something conditionally, and usually will return the same state because they did no side effects.
 */
const setState = createHandler((_oldState, newState: State) => newState);

const effects: Effect[] = [ensureConnection, removeWsListeners];

const subscribeEffects = subscribe
  .with(time(1000))
  .with(skipDuplicates())
  .with(perTick());

subscribeEffects((state, now) => {
  setState(effects.reduce((newState, effect) => effect(newState, now), state));
});
