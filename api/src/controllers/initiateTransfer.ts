import { IStartTransferQuery } from "../models/interfaces";
import { Response } from "express";
import StatusCodes from "http-status-codes";

import { ServerKey } from "../models";

const initiateTransferController = async (req, res: Response) => {
  const query : IStartTransferQuery = req.query;

  if(!query.sectorIdentifier) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Request must contain sectorIdentifier parameter!"
    });
  }


};

export default initiateTransferController;
