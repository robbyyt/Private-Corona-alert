import { Router } from "express";
import StatusCodes from "http-status-codes";

import { initiateTransferController } from "../controllers";

const router = Router();

router.get('/initiate-transfer', initiateTransferController);

export default router;
