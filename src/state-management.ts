// We define a reducer as a function of the form (state, ...data) => newState.
// A handler is a function of the form (...data) => void.
// Once an initial state is given we can turn reducers into handlers.
// We can then supply a stream of states to anyone who subscribes.

export const initState = <State>(initialState: State): InitState<State> => {
  const subscribers = new Set<(state: State) => void>();
  let state: State = initialState;
  const pushState = (): undefined => {
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

  const subscribe = (sub: (state: State) => void): void => {
    sub(state);
    subscribers.add(sub);
  };

  const unsubscribe = (sub: (state: State) => void): void => {
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
  subscribe: (sub: (state: State) => void) => void;
  unsubscribe: (sub: (state: State) => void) => void;
};
