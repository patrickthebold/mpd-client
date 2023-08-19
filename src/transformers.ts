import { type ConsumerTransformer, type Scheduler } from "./types";

const makeThrottler =
  <T extends unknown[]>(scheduleWork: Scheduler): ConsumerTransformer<T> =>
  (consumer) => {
    let workScheduled = false;
    let latestValue: T;
    return (...t: T) => {
      latestValue = t;
      if (!workScheduled) {
        scheduleWork(() => {
          consumer(...latestValue);
          workScheduled = false;
        });
      }
    };
  };

export const perTick = <T extends unknown[]>(): ConsumerTransformer<T> =>
  makeThrottler(queueMicrotask);
export const perAnimationFrame = <
  T extends unknown[]
>(): ConsumerTransformer<T> => makeThrottler(requestAnimationFrame);

export const skipDuplicates =
  <T extends unknown[]>(): ConsumerTransformer<T> =>
  (consumer) => {
    let lastValue: T;
    return (...t: T) => {
      if (t !== lastValue) {
        lastValue = t;
        consumer(...t);
      }
    };
  };
