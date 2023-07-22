import { type RecordOf, Record as iRecord } from "immutable";

declare const brand: unique symbol;
type Brand<A, B> = A & { [brand]: B };
export type BrandString<B> = Brand<string, B>;

type Defaults<T extends object, requiredKeys> = {
  [k in keyof T]-?: k extends requiredKeys
    ? undefined
    : T extends Record<k, T[k]>
    ? T[k]
    : T[k] | undefined;
};

type PropParam<T extends object, requiredKeys extends keyof T> = Partial<T> & {
  [k in requiredKeys]: T[k];
};

export const BetterRecord = <
  Props extends object,
  requiredKeys extends keyof Props = never
>(
  defaults: Defaults<Props, requiredKeys>
): ((props: PropParam<Props, requiredKeys>) => RecordOf<Props>) =>
  iRecord<Props>(defaults as Props);
