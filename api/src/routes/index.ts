import { Router } from "express";
import StatusCodes from "http-status-codes";

import { initiateTransferController, completeTransferController } from "../controllers";

const router = Router();

router.get('/initiate-transfer', initiateTransferController);
router.get('/complete-transfer', completeTransferController);

export default router;
