// We define a reducer as a function of the form (state, ...data) => newState.
// A handler is a function of the form (...data) => void.
// Once an initial state is given we can turn reducers into handlers.
// We can then supply a stream of states to anyone who subscribes.

import { type Consumer } from "./types";

export const initState = <State>(initialState: State): InitState<State> => {
  const subscribers = new Set<Consumer<State>>();
  let state: State = initialState;
  const pushState = (): void => {
    subscribers.forEach((sub) => {
      sub(state);
    });
  };

  const createHandler =
    <D extends unknown[]>(reducer: (s: State, ...args: D) => State) =>
    (...data: D) => {
      state = reducer(state, ...data);
      pushState();
    };

  const subscribe = (sub: Consumer<State>): void => {
    sub(state);
    subscribers.add(sub);
  };

  const unsubscribe = (sub: Consumer<State>): void => {
    subscribers.delete(sub);
  };
  return {
    createHandler,
    subscribe,
    unsubscribe,
  };
};

type InitState<State> = {
  createHandler: <D extends unknown[]>(
    reducer: (s: State, ...args: D) => State
  ) => (...data: D) => void;
  subscribe: (sub: Consumer<State>) => void;
  unsubscribe: (sub: Consumer<State>) => void;
};
