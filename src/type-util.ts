import { type RecordOf, Record as iRecord } from "immutable";

declare const brand: unique symbol;
type Brand<A, B> = A & { [brand]: B };
export type BrandString<B> = Brand<string, B>;

type ExplicitUndefined<T extends object> = {
  [k in keyof T]-?: T extends Record<k, T[k]> ? T[k] : T[k] | undefined;
};

type SetUndefined<T extends object, requiredKeys> = {
  [k in keyof T]: k extends requiredKeys ? undefined : T[k];
};

type DefaultProps<T extends object, requiredKeys> = SetUndefined<
  ExplicitUndefined<T>,
  requiredKeys
>;

type FactoryProps<
  T extends object,
  requiredKeys extends keyof T
> = Partial<T> & {
  [k in requiredKeys]: T[k];
};

export const BetterRecord = <
  Props extends object,
  requiredKeys extends keyof Props = never
>(
  defaults: DefaultProps<Props, requiredKeys>
): Partial<Props> extends FactoryProps<Props, requiredKeys>
  ? (props?: Partial<Props>) => RecordOf<Props>
  : (props: FactoryProps<Props, requiredKeys>) => RecordOf<Props> =>
  iRecord<Props>(defaults as Props);
