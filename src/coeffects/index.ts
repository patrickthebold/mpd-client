import type {
  ConsumerTransformer,
  Callback,
  Consumer,
  Producer,
} from "../types";

export const makeCoeffect = <T extends unknown[], S>(
  producer: Producer<S>
): {
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
