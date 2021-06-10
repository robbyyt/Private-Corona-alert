import { IOTSenderInitialValues } from "./models"
import { getPermutation, getPermutationInverse } from "./utils/permutation";

interface OTReceiver extends IOTSenderInitialValues {
  sigma: number[],
  sigmaInverse: number[],
  sigmaPacket: bigint[][],
  messageBitCount: number
}

class OTReceiver {

  constructor(n: bigint, y: bigint, zArray: bigint[][]) {
    this.n = n;
    this.y = y;
    this.zArray = zArray;
    this.messageBitCount = zArray[0].length;
  }

  preparePermutationValues(): bigint[][] {
    const sigmaPacket = [];
    this.sigma = getPermutation(this.zArray.length);
    this.sigmaInverse = getPermutationInverse(this.sigma);

    for(const [k , zEncoding] of this.zArray.entries()) {
      const i =  this.sigmaInverse[k];
      const current: bigint[] = [];

      for(let j = 0; j < this.messageBitCount; j++) {
        const q = this.zArray[i][j];
      }
    }

    this.sigmaPacket = sigmaPacket;
    return sigmaPacket;
  }
};
