import ISafePrime from "./SafePrime";

interface IRSAModulus {
  p: ISafePrime;
  q: ISafePrime;
  value: bigint;
}

export default IRSAModulus;
