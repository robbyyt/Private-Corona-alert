import { Response } from "express";
import StatusCodes from "http-status-codes";
import { OTSender } from "../andos";
import { SectorInformation } from "../models";
import { ICompleteTransferBody, ICompleteTransferQuery } from "../models/interfaces";
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

  if(!body.receiverRequest || !(typeof body.receiverRequest === "number") || body.receiverRequest >= MESSAGES_PER_SECTOR) {
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
};

export default completeTransferController;
