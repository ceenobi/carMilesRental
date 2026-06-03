import Payment from "../models/payment.js";
import User from "../models/user.js";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import { sendTsRestError, sendTsRestSuccess } from "../lib/responseHandler.js";
import { Request, Response } from "express";


export const getUserPayments = tryCatchWrapper(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.userId).lean();
    if (!user) {
        return sendTsRestError(res, 404, "User not found");
    }
    const payments = await Payment.find({ userId: req.params.userId }).lean();
    return sendTsRestSuccess(res, 200, payments);
})
