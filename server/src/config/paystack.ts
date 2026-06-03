import axios from "axios";
import { env } from "./keys.js";
import logger from "./logger.js";

export const PAYSTACK_SECRET_KEY = env.PAYSTACK_SECRET_KEY!;
export const PAYSTACK_BASE_URL = "https://api.paystack.co";

let paystackInstance: any = null;

export const getPaystack = () => {
  if (!paystackInstance) {
    const secret = PAYSTACK_SECRET_KEY;
    if (!secret) {
      throw new Error("PAYSTACK_SECRET_KEY is not defined. Please add it to your .env file");
    }
    logger.info("Paystack key configured");
    paystackInstance = axios.create({
      baseURL: PAYSTACK_BASE_URL,
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    });
  }
  return paystackInstance;
};