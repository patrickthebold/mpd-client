export type Consumer<T extends unknown[]> = (...t: T) => void;
export type Producer<T> = () => T;
export type ConsumerTransformer<
  T extends unknown[],
  S extends unknown[] = T
> = (consumer: Consumer<T>) => Consumer<S>;
export type Callback = () => void;
export type Scheduler = Consumer<[Callback]>;
