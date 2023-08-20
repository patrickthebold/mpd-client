type ConfigurableFunction<F extends (arg: any) => any> = F & {
  with: <C>(
    transformer: (c: C) => Parameters<F>[0]
  ) => ConfigurableFunction<(c: C) => ReturnType<F>>;
};

export const makeConfigurable = <F extends (arg: any) => any>(
  f: F
): ConfigurableFunction<F> => Object.assign(f, { with: withProperty });

function withProperty<F extends (arg: any) => any, C>(
  this: F,
  transformer: (c: C) => Parameters<F>
): ConfigurableFunction<(c: C) => ReturnType<F>> {
  return makeConfigurable((c: C) => this(transformer(c)));
}
