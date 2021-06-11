import { IOTSenderInitialValues, IRSAModulus, ISafePrime } from "./models";
import { generateQNRModRSA, computeJacobiLegendreSymbol, generateRSACoprimeValue } from "./utils/primes";

interface OTSender {
  p: ISafePrime;
  q: ISafePrime;
  n: IRSAModulus;
  messageBitCount: number;
  messages: string[];
  receiverSigmaPacket: bigint[][],
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
    Jacobi symbol of y = ${computeJacobiLegendreSymbol(y, this.n.value)}
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

  setReceiverPacket(sigmaPacket: bigint[][]): void {
    this.receiverSigmaPacket = sigmaPacket;
  }

  processReceiverRequest(k: number): number[] {
    if(!this.receiverSigmaPacket.length) {
      throw new Error("Receiver sigma packet not set!");
    }
    const qrArr: number[] = [];
    for(let j = 0; j < this.messageBitCount; j++) {
      if(computeJacobiLegendreSymbol(this.receiverSigmaPacket[k][j], this.p.value) === 1 && computeJacobiLegendreSymbol(this.receiverSigmaPacket[k][j], this.q.value) === 1) {
        qrArr.push(1);
      } else {
        qrArr.push(0);
      }
    }

    return qrArr;
  }
}

export default OTSender;



