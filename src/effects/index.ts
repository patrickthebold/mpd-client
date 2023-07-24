import { type State, createHandler, subscribe } from "../state";
import { ensureConnection, removeWsListeners } from "./ensureConnection";
import { type Effect } from "./types";

/**
 * Effects will observe state changes. The must return a different value for the state if
 * they actually perform a side effect. All side effects should happen here. Typically they will
 * do something conditionally, and usually will return the same state because they did no side effects.
 */

const setState = createHandler((_oldState, newState: State) => newState);

const effects: Effect[] = [ensureConnection, removeWsListeners];

subscribe((state) => {
  let newState = state;
  for (const effect of effects) {
    newState = effect(newState);
  }
  if (newState !== state) {
    setState(newState);
  }
});
