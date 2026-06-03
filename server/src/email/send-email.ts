import { IUser } from "../models/user.js";
import FailedEmail from "../models/failedEmail.js";
import { sendEmail } from "../config/email.js";
import {
  verifyAccountTemplate,
  requestForgotPasswordTemplate,
  passwordResetSuccessTemplate,
  bookingConfirmationTemplate,
  paymentConfirmationTemplate,
} from "./templates.js";

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calculate OTP expiry (15 minutes from now)
export const getOtpExpiry = (): Date => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

// Send verification email or queue if fails
const sendVerificationEmail = async ({
  user,
  otp,
  link,
}: {
  user: IUser;
  otp: string;
  link: string;
}): Promise<{ success: boolean; queued: boolean }> => {
  const htmlBody = verifyAccountTemplate(user.fullname, otp, link);

  const result = await sendEmail({
    email: user.email,
    subject: "Verify your account - Miles Car",
    message: htmlBody,
  });

  if (result.success) {
    return { success: true, queued: false };
  }

  // Queue for retry
  await FailedEmail.create({
    userId: user._id,
    email: user.email,
    otp,
    fullname: user.fullname,
    subject: "Verify your account - Miles Car",
    attempts: 1,
    status: "pending",
  });

  return { success: false, queued: true };
};

const sendForgotPasswordEmail = async ({
  user,
  otp,
  link,
}: {
  user: IUser;
  otp: string;
  link: string;
}): Promise<{ success: boolean; queued: boolean }> => {
  const htmlBody = requestForgotPasswordTemplate(user.fullname, otp, link);

  const result = await sendEmail({
    email: user.email,
    subject: "Reset your password - Miles Car",
    message: htmlBody,
  });

  if (result.success) {
    return { success: true, queued: false };
  }

  // Queue for retry
  await FailedEmail.create({
    userId: user._id,
    email: user.email,
    otp,
    fullname: user.fullname,
    subject: "Reset your password - Miles Car",
    attempts: 1,
    status: "pending",
  });

  return { success: false, queued: true };
};

const sendPasswordResetSuccessEmail = async ({
  user,
}: {
  user: IUser;
}): Promise<{ success: boolean; queued: boolean }> => {
  const htmlBody = passwordResetSuccessTemplate(user.fullname);

  const result = await sendEmail({
    email: user.email,
    subject: "Password Reset Successful - Miles Car",
    message: htmlBody,
  });

  if (result.success) {
    return { success: true, queued: false };
  }

  // Queue for retry
  await FailedEmail.create({
    userId: user._id,
    email: user.email,
    fullname: user.fullname,
    subject: "Password Reset Successful - Miles Car",
    attempts: 1,
    status: "pending",
  });

  return { success: false, queued: true };
};

// Retry all pending failed emails (called by cron job)
const retryFailedEmails = async (): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> => {
  const pendingEmails = await FailedEmail.find({
    status: "pending",
    attempts: { $lt: 3 },
  });

  let succeeded = 0;
  let failed = 0;

  for (const record of pendingEmails) {
    const htmlBody = verifyAccountTemplate(record.fullname, record.otp, "");

    const result = await sendEmail({
      email: record.email,
      subject: record.subject,
      message: htmlBody,
    });

    record.attempts += 1;
    record.lastAttemptAt = new Date();

    if (result.success) {
      record.status = "sent";
      succeeded++;
    } else if (record.attempts >= 3) {
      record.status = "failed";
      failed++;
    }

    await record.save();
  }

  // Cleanup old sent/failed records (older than 24 hours)
  await FailedEmail.deleteMany({
    status: { $in: ["sent", "failed"] },
    updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  return { processed: pendingEmails.length, succeeded, failed };
};

const sendBookingConfirmationEmail = async ({
  email,
  fullname,
  carName,
  carType,
  pickUpLocation,
  dropOffLocation,
  pickUpDate,
  dropOffDate,
  pickUpTime,
  dropOffTime,
  rentalTotal,
  serviceFee,
  grandTotal,
  addDriver,
}: {
  email: string;
  fullname: string;
  carName: string;
  carType: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  dropOffDate: string;
  pickUpTime: string;
  dropOffTime: string;
  rentalTotal: string;
  serviceFee: string;
  grandTotal: string;
  addDriver: boolean;
}): Promise<{ success: boolean; queued: boolean }> => {
  const htmlBody = bookingConfirmationTemplate(
    fullname,
    carName,
    carType,
    pickUpLocation,
    dropOffLocation,
    pickUpDate,
    dropOffDate,
    pickUpTime,
    dropOffTime,
    rentalTotal,
    serviceFee,
    grandTotal,
    addDriver,
  );

  const result = await sendEmail({
    email,
    subject: "Booking Confirmed - Miles Car",
    message: htmlBody,
  });

  if (result.success) {
    return { success: true, queued: false };
  }

  await FailedEmail.create({
    email,
    fullname,
    subject: "Booking Confirmed - Miles Car",
    attempts: 1,
    status: "pending",
  });

  return { success: false, queued: true };
};

const sendPaymentConfirmationEmail = async ({
  email,
  fullname,
  amount,
  reference,
  paymentMethod,
  paidAt,
}: {
  email: string;
  fullname: string;
  amount: string;
  reference: string;
  paymentMethod: string;
  paidAt: string;
}): Promise<{ success: boolean; queued: boolean }> => {
  const htmlBody = paymentConfirmationTemplate(
    fullname,
    amount,
    reference,
    paymentMethod,
    paidAt,
  );

  const result = await sendEmail({
    email,
    subject: "Payment Confirmed - Miles Car",
    message: htmlBody,
  });

  if (result.success) {
    return { success: true, queued: false };
  }

  await FailedEmail.create({
    email,
    fullname,
    subject: "Payment Confirmed - Miles Car",
    attempts: 1,
    status: "pending",
  });

  return { success: false, queued: true };
};

const emailService = {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetSuccessEmail,
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  retryFailedEmails,
  generateOTP,
  getOtpExpiry,
};

export default emailService;
