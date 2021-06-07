import { IOTSenderInitialValues, IRSAModulus, ISafePrime } from "./models";
import { generateQNRModRSA, computeJacobiSymbol, generateRSACoprimeValue } from "./utils/primes";

interface OTSender {
  p: ISafePrime;
  q: ISafePrime;
  n: IRSAModulus;
  messageBitCount: number;
  messages: string[] ;
};

class OTSender {
  /**
   *
   * @param p
   * A safe prime
   * @param q
   * A safe prime
   * @param messageBitCount
   * The predefined bitcount for each message
   * @param messages
   * An array of bitstrings of length equal to messageBitCount
   */
  constructor(p: ISafePrime, q: ISafePrime, messageBitCount: number, messages: string[]) {
    this.p = p;
    this.q = q;
    this.messageBitCount = messageBitCount;
    this.messages = [...messages];
    this.n = {
      p,
      q,
      value: this.p.value * this.q.value
    };
  }

  prepareInitialValues(): IOTSenderInitialValues {
    const y = generateQNRModRSA(this.n);
    console.log(
    `Generated y = ${y}
    Jacobi symbol of y = ${computeJacobiSymbol(y, this.n.value)}
    `);
    const zArray: bigint[][] = [];

    for(const message of this.messages) {
      const encoding: bigint[] = [];
      for(const currentBit of message) {
        const c = generateRSACoprimeValue(this.n);
        const z = ((c ** 2n) * (y ** BigInt(currentBit))) % this.n.value;
        encoding.push(z);
      }
      zArray.push(encoding);
    }

    return {
      n: this.n.value,
      y,
      zArray
    };
  }
}

export default OTSender;



