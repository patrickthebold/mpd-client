export type Consumer<T extends unknown[]> = (...t: T) => void;
export type Producer<T> = () => T;
export type ConsumerTransformer<
  T extends unknown[],
  S extends unknown[] = T
> = (consumer: Consumer<T>) => Consumer<S>;
export type Callback = () => void;
export type Scheduler = Consumer<[Callback]>;

export type Reducer<State, D extends unknown[]> = (
  state: State,
  ...args: D
) => State;
export type ReducerTransformer<
  State,
  T extends unknown[],
  D extends unknown[]
> = (Reducer: Reducer<State, T>) => Reducer<State, D>;

export type Handler<T extends unknown[]> = (...t: T) => void;
