import { type ConsumerTransformer, type Scheduler } from "./types";

const makeThrottler =
  <T>(scheduleWork: Scheduler): ConsumerTransformer<T> =>
  (consumer) => {
    let workScheduled = false;
    let latestValue: T;
    return (t: T) => {
      latestValue = t;
      if (!workScheduled) {
        scheduleWork(() => {
          consumer(latestValue);
          workScheduled = false;
        });
      }
    };
  };

export const perTick = <T>(): ConsumerTransformer<T> =>
  makeThrottler(queueMicrotask);
export const perAnimationFrame = <T>(): ConsumerTransformer<T> =>
  makeThrottler(requestAnimationFrame);

export const skipDuplicates =
  <T>(): ConsumerTransformer<T> =>
  (consumer) => {
    let lastValue: T;
    return (t: T) => {
      if (t !== lastValue) {
        lastValue = t;
        consumer(t);
      }
    };
  };
