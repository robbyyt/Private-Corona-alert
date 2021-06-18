import { IOTSenderInitialValues } from "./models"
import { getPermutation, getPermutationInverse } from "./utils/permutation";
import { randBetween } from 'bigint-crypto-utils';

interface OTReceiver extends IOTSenderInitialValues {
  sigma: number[],
  sigmaInverse: number[],
  sigmaPacket: bigint[][],
  aValues: number[][],
  rValues: bigint[][],
  messageBitCount: number,
  choice: number
}

class OTReceiver {

  constructor(n: bigint, y: bigint, zArray: bigint[][]) {
    this.n = n;
    this.y = y;
    this.zArray = zArray;
    this.messageBitCount = zArray[0].length;
    this.sigmaPacket = [];
    this.aValues = [];
    this.rValues = [];
  }

  preparePermutationValues(): bigint[][] {
    this.sigma = getPermutation(this.zArray.length);
    this.sigmaInverse = getPermutationInverse(this.sigma);

    this.sigmaPacket = [];
    this.rValues = [];
    this.aValues = [];

    for(const [k , zEncoding] of this.zArray.entries()) {
      const i =  this.sigmaInverse[k];
      const currentQs: bigint[] = [];
      const currentAs: number[] = [];
      const currentRs: bigint[] = []

      for(let j = 0; j < this.messageBitCount; j++) {
        const a = Math.round(Math.random());
        const r = randBetween(this.n - 1n, 0n);
        let q: bigint = this.zArray[i][j];
        q = q * ((r * r) % this.n) % this.n;
        q = a === 1 ? (q * this.y) % this.n : q;

        currentAs.push(a);
        currentRs.push(r);
        currentQs.push(q);
      }
      this.sigmaPacket.push(currentQs);
      this.aValues.push(currentAs);
      this.rValues.push(currentRs);
    }

    return this.sigmaPacket
  }

  setChoice(num: number) {
    if(num < 0 || num >= this.zArray.length) {
      throw new Error("Choice must me in range 0, N-1!");
    }
    this.choice = num;
  }

  interpretSenderResponse(senderResponse: number[]) {

    let senderValue = "";
    for(let j = 0; j < this.messageBitCount; j++) {
      if(senderResponse[j] === this.aValues[this.sigma[this.choice]][j]) {
        senderValue += "1";
      } else {
        senderValue += "0";
      }
    }

    return senderValue;
  }
};

export default OTReceiver;
