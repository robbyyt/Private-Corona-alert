export interface ICompleteTransferBody {
  sigmaPacket: string[][];
  receiverRequest: number | number[];
};

export interface InitiateTransferResponse {
  n: string;
  y: string;
  zArray: string[][];
};

export interface CompleteTransferResponse {
  response : number[][]
};
