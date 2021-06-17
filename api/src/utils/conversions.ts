import { ISafePrime } from "../andos/models";

export const serializeSafePrime = (p: ISafePrime) => {
  return JSON.stringify({
    value: p.value.toString(),
    basePrime: p.basePrime.toString()
  });
};

export const convertBigIntMatrixToString = (matrix: bigint[][]): string[][] => {
  const result: string[][] = [];

  for(let i = 0; i < matrix.length; i++) {
    const current: string[] = [];
    for(let j = 0; j < matrix[0].length; j++) {
      current.push(matrix[i][j].toString());
    }
    result.push(current);
  }

  return result;
};

export const convertStringMatrixToBigInt = (matrix: string[][]): bigint[][] => {
  const result: bigint[][] = [];

  for(let i = 0; i < matrix.length; i++) {
    const current: bigint[] = [];
    for(let j = 0; j < matrix[0].length; j++) {
      current.push(BigInt(matrix[i][j]));
    }
    result.push(current);
  }

  return result;
};
