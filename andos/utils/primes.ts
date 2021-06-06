import { primeSync, isProbablyPrime, randBetween } from 'bigint-crypto-utils';
import { ISafePrime, IRSAModulus } from '../models';

/**
 *
 * @param bitNumber
 * The number of bits of the prime.
 * @param millerRabinIterationCount
 * The number of iterations for the Miller-Rabin primality test.
 * @returns
 * A safe prime.
 */
export const generateSafePrime = async (bitNumber = 1024, millerRabinIterationCount = 40): Promise<ISafePrime> => {
  let q: bigint = primeSync(bitNumber, millerRabinIterationCount);
  let p: bigint = 2n * q + 1n;
  let isPrime: boolean = await isProbablyPrime(p, millerRabinIterationCount, true);

  while(!isPrime) {
    q = primeSync(bitNumber, millerRabinIterationCount);
    p = 2n * q + 1n;
    isPrime = await isProbablyPrime(p, millerRabinIterationCount, true);
  }

  return {
    value: p,
    basePrime: q
  };
}

/**
 *
 * @param n
 * A RSA modulus n = pq, where p and q are primes
 * @returns
 * A number a such that a is in Z*_n
 */
export const generateRSACoprimeValue = (n: IRSAModulus): bigint => {
  let a = randBetween(n.value - 1n);

  while(a === n.q.value || a === n.p.value) {
    a = randBetween(n.value);
  }

  return a;
}

/**
 *
 * @param a
 * A number.
 * @param n
 * A modulus.
 * @returns
 * The Jacobi Symbol (a/n)
 */
export const computeJacobiSymbol = (a: bigint, n: bigint): number => {
  if( !(n % 2n) || (n <= 0) ) {
    throw new Error("The modulus for the Jacobi symbol must me an odd positive integer");
  }
  let t: number = 1;
    a = a % n;

  while(a !== 0n) {
    while(a % 2n === 0n) {
      a = a / 2n;

      if(n % 8n === 3n || n % 8n === 5n) {
        t = -t;
      }
    }
    // swapping a and n
    [a, n] = [n, a];
    if(a % 4n === 3n && n % 4n === 3n) {
      t = -t;
    }
    a = a % n;
  }
  return t;
}

/**
 *
 * @param p
 * A prime number.
 * @returns
 * A quadratic non-residue modulo p.
 */
export const generateQNRModPrime = (p: bigint): bigint => {
  if(p % 4n === 3n)  return -1n;
  if(p % 8n === 5n) return 2n;

  let a = randBetween(p - 1n);

  while(computeJacobiSymbol(a, p) != -1) {
    a = randBetween(p - 1n);
  }

  return a;
}

export const generateQNRModRSA = (p: bigint, q: bigint): bigint => {
  let a = generateQNRModPrime(p);

  while(computeJacobiSymbol(a, q) != -1) {
    a = generateQNRModPrime(p);
  }

  return a;
};

