import { IStartTransferQuery } from "../models/interfaces";
import { Response } from "express";
import StatusCodes from "http-status-codes";
import { MESSAGES_PER_SECTOR, MESSAGE_BIT_COUNT, sectorIdRegex } from "../constants/ot";
import { OTSender } from "../andos";
import { generateRandomMessageArray } from "../utils/random";
import { convertBigIntMatrixToString } from "../utils/conversions";
import { ServerKey, SectorInformation } from "../models";


const initiateTransferController = async (req, res: Response) => {
  const query : IStartTransferQuery = req.query;

  if(!query.sectorIdentifier || !sectorIdRegex.test(query.sectorIdentifier)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Request must contain a valid sectorIdentifier parameter!"
    });
  }

  const [{n, y, p, q}] = await ServerKey.find();
  const sector = await SectorInformation.findOne({sectorIdentifier: query.sectorIdentifier});

  if(!sector) {
    const qObj = JSON.parse(q);
    const pObj = JSON.parse(p);

    pObj.value = BigInt(pObj.value);
    pObj.basePrime = BigInt(pObj.basePrime);
    qObj.value = BigInt(qObj.value);
    qObj.basePrime = BigInt(qObj.basePrime);

    const sectorMessages = generateRandomMessageArray(MESSAGE_BIT_COUNT, MESSAGES_PER_SECTOR)
    const sender = new OTSender(pObj, qObj, MESSAGE_BIT_COUNT, sectorMessages, BigInt(y));
    const { zArray } = sender.prepareInitialValues();
    const stringZarray = convertBigIntMatrixToString(zArray);

    const newSector = new SectorInformation({
      sectorIdentifier: query.sectorIdentifier,
      locationInformation: sectorMessages,
      locationZArray: stringZarray
    });

    await newSector.save();

    return res.status(StatusCodes.OK).json({
      n,
      y,
      zArray: stringZarray
    });
  } else {
    return res.status(StatusCodes.OK).json({
      n,
      y,
      zArray: sector.locationZArray
    });
  }
};

export default initiateTransferController;
