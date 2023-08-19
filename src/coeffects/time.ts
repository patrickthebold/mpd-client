import { makeCoeffect } from ".";
import type { ConsumerTransformer } from "../types";

export const time = <T extends unknown[]>(
  millis: number
): ConsumerTransformer<[...T, Date], T> => {
  const { transformer, trigger } = makeCoeffect<T, Date>(() => new Date());
  setInterval(trigger, millis);
  return transformer;
};
