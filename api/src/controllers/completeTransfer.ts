import { Response } from "express";
import StatusCodes from "http-status-codes";
import { OTSender } from "../andos";
import { SectorInformation, ServerKey } from "../models";
import { ICompleteTransferBody, ICompleteTransferQuery } from "../models/interfaces";
import { convertStringMatrixToBigInt } from "../utils/conversions";
import { MESSAGE_BIT_COUNT, sectorIdRegex, MESSAGES_PER_SECTOR } from "../constants/ot";

const completeTransferController = async (req, res: Response) => {
  const query : ICompleteTransferQuery = req.query;

  if(!query.sectorIdentifier || !sectorIdRegex.test(query.sectorIdentifier)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Request must contain a valid sectorIdentifier parameter!"
    });
  }

  const body: ICompleteTransferBody = req.body;

  if(!body.sigmaPacket || !body.sigmaPacket.length || !body.sigmaPacket[0].length) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Request body must contain a valid sigmaPacket parameter!"
    });
  }

  if(!body.receiverRequest || !(typeof body.receiverRequest === "number" || Array.isArray(body.receiverRequest)) || body.receiverRequest >= MESSAGES_PER_SECTOR) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Request body must contain a valid receiverRequest parameter!"
    });
  }

  const sector = await SectorInformation.findOne({sectorIdentifier: query.sectorIdentifier});

  if(!sector) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Sector not found! Try initiating a transfer first."
    });
  }

  try {
    const [{n, y, p, q}] = await ServerKey.find();
    const qObj = JSON.parse(q);
    const pObj = JSON.parse(p);

    pObj.value = BigInt(pObj.value);
    pObj.basePrime = BigInt(pObj.basePrime);
    qObj.value = BigInt(qObj.value);
    qObj.basePrime = BigInt(qObj.basePrime);
    const sectorMessages = sector.locationInformation;
    const sender = new OTSender(pObj, qObj, MESSAGE_BIT_COUNT, sectorMessages, BigInt(y));
    const sigmaPacket: bigint[][] = convertStringMatrixToBigInt(body.sigmaPacket);
    sender.setReceiverPacket(sigmaPacket);

    const response: number[][] = [];

    if(!Array.isArray(body.receiverRequest)) {
      response.push(sender.processReceiverRequest(body.receiverRequest))
    } else {
      for(const request of body.receiverRequest) {
        response.push(sender.processReceiverRequest(request));
      }
    }

    return res.status(StatusCodes.OK).json({
      results: response
    });
  }
catch(e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Server error, are you sure your sigma packet was valid?"
    });
  }
};

export default completeTransferController;
