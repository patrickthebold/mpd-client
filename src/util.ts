export const pull =
  <A, B>(f: (a: A) => B) =>
  <C>(g: (b: B) => C) =>
  (a: A) =>
    g(f(a));
export const compose =
  <A, B, C>(g: (b: B) => C, f: (a: A) => B) =>
  (a: A) =>
    g(f(a));
