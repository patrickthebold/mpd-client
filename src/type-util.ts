declare const brand: unique symbol;
type Brand<A, B> = A & {[brand]: B}
export type BrandString<B> = Brand<string, B>