import { type State, createHandler, subscribe } from "../state";
import { type Effect } from "./types";

/**
 * Effects will observe state changes. The must return a different value for the state if
 * they actually perform a side effect. All side effects should happen here. Typically they will
 * do something conditionally, and usually will return the same state because they did no side effects.
 */

// The queue microtask is probably unnecessary in practice. When we set the state will will be fed the newState
// back into the function passed to `subscribe`. I want to unwind the stack before I call that function again.
const setStateSync = createHandler((_oldState, newState: State) => newState);
const setState = (state: State): void => {
  queueMicrotask(() => {
    setStateSync(state);
  });
};

const effects: Effect[] = [];

subscribe((state) => {
  let newState = state;
  for (const effect of effects) {
    newState = effect(newState);
  }
  if (newState !== state) {
    setState(newState);
  }
});
