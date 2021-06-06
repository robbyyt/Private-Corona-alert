/**
 * A safe prime is a number p such that p = 2q + 1, where q is also a prime
 */
interface ISafePrime {
  value: bigint;
  basePrime: bigint;
}

export default ISafePrime;
