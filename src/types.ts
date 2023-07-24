export type Consumer<T> = (t: T) => void;
export type ConsumerTransformer<T, S = T> = (
  mapper: Consumer<T>
) => Consumer<S>;
export type Callback = () => void;
export type Scheduler = Consumer<Callback>;
