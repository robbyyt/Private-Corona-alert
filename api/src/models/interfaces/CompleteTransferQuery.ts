interface ICompleteTransferQuery {
  sectorIdentifier: string,
}

interface ICompleteTransferBody {
  sigmaPacket: string[][],
  receiverRequest: number | number[]
}

export {ICompleteTransferBody, ICompleteTransferQuery};
