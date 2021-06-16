interface ICompleteTransferQuery {
  sectorIdentifier: string,
}

interface ICompleteTransferBody {
  sigmaPacket: string[][],
  receiverRequest: number
}

export {ICompleteTransferBody, ICompleteTransferQuery};
