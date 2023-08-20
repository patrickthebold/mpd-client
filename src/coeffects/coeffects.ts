import type {
  ConsumerTransformer,
  Callback,
  Consumer,
  Producer,
  ReducerTransformer,
} from "../types";

export const coeffect = <S>(
  producer: Producer<S>
): {
  make: <T extends unknown[]>() => {
    transformer: ConsumerTransformer<[...T, S], T>;
    trigger: Callback;
  };
  reducerTransformer: <State, D extends unknown[]>() => ReducerTransformer<
    State,
    [S, ...D],
    D
  >;
} => {
  const make = <T extends unknown[]>(): {
    transformer: ConsumerTransformer<[...T, S], T>;
    trigger: Callback;
  } => {
    const consumers: Array<Consumer<[...T, S]>> = [];
    let currentT: T;
    const trigger: Callback = () => {
      consumers.forEach((c) => {
        c(...currentT, producer());
      });
    };
    const transformer: ConsumerTransformer<[...T, S], T> = (consumer) => {
      consumers.push(consumer);
      return (...t: T) => {
        consumer(...t, producer());
      };
    };
    return {
      transformer,
      trigger,
    };
  };
  const reducerTransformer: <
    State,
    D extends unknown[]
  >() => ReducerTransformer<State, [S, ...D], D> =
    () =>
    (reducer) =>
    (state, ...args) =>
      reducer(state, producer(), ...args);
  return { make, reducerTransformer };
};
