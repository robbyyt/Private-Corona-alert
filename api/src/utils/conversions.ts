import { ISafePrime } from "../andos/models";

export const serializeSafePrime = (p: ISafePrime) => {
  return JSON.stringify({
    value: p.value.toString(),
    basePrime: p.basePrime.toString()
  });
};
