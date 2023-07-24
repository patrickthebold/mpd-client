type ConfigurableFunction<A, B> = {
  with: <C>(transformer: (c: C) => A) => ConfigurableFunction<C, B>;
  (a: A): B;
};

export const makeConfigurable = <A, B>(
  f: (a: A) => B
): ConfigurableFunction<A, B> => Object.assign(f, { with: withProperty });

function withProperty<A, B, C>(
  this: (a: A) => B,
  transformer: (c: C) => A
): ConfigurableFunction<C, B> {
  return makeConfigurable((c: C) => this(transformer(c)));
}
