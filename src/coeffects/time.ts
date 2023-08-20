import { coeffect } from "./coeffects";
import type { ConsumerTransformer } from "../types";

const { make, reducerTransformer } = coeffect<Date>(() => new Date());

export const time = <T extends unknown[]>(
  millis: number
): ConsumerTransformer<[...T, Date], T> => {
  const { transformer, trigger } = make<T>();
  setInterval(trigger, millis);
  return transformer;
};

export const currentTime = reducerTransformer;
