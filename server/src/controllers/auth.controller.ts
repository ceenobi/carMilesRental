import User from "../models/user.js";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import { sendTsRestError, sendTsRestSuccess } from "../lib/responseHandler.js";
import emailService from "../email/send-email.js";
import logger from "../config/logger.js";
import { env } from "../config/keys.js";

const verifyEmailLink = `${env.CLIENT_URL}/verify-email`;

export const createUser = tryCatchWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const findAccount = await User.findOne({ email: req.body.email }).lean();
    if (findAccount) {
      return sendTsRestError(res, 400, "Account already exists");
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      ...req.body,
      password: hash,
    });
    // Generate and save OTP
    const otp = emailService.generateOTP();
    const expiresAt = emailService.getOtpExpiry();

    await User.findByIdAndUpdate(user._id, {
      otp: {
        code: otp,
        expiresAt,
        attempts: 0,
      },
      otpLastSentAt: new Date(),
    });

    // Send verification email (fire-and-forget, queue on failure)
    emailService
      .sendVerificationEmail({ user, otp, link: verifyEmailLink })
      .catch((err) => {
        logger.error(
          { err, userId: user._id },
          "Failed to send verification email",
        );
      });

    return sendTsRestSuccess(res, 201, {
      success: true,
      message:
        "Registration successful. We have sent a code to your email to verify your account.",
      emailPending: true,
      body: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
      },
    });
  },
);

// Verify email with OTP
export const verifyEmail = tryCatchWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { otp } = req.body;
    const email = req.query.email as string;

    if (!email || !otp) {
      return sendTsRestError(res, 400, "Email and OTP are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendTsRestError(res, 404, "User not found");
    }

    if (user.emailVerified) {
      return sendTsRestError(res, 400, "Email already verified");
    }

    if (!user.otp || !user.otp.code) {
      return sendTsRestError(
        res,
        400,
        "No OTP found. Please request a new one.",
      );
    }

    // Check OTP expiry
    if (new Date() > user.otp.expiresAt) {
      return sendTsRestError(
        res,
        400,
        "OTP has expired. Please request a new one.",
      );
    }

    // Check attempts
    if (user.otp.attempts >= 3) {
      return sendTsRestError(
        res,
        400,
        "Too many failed attempts. Please request a new OTP.",
      );
    }

    // Validate OTP
    if (user.otp.code !== otp) {
      user.otp.attempts += 1;
      await user.save();
      return sendTsRestError(
        res,
        400,
        `Invalid OTP. ${3 - user.otp.attempts} attempts remaining.`,
      );
    }

    // Mark email as verified and clear OTP
    user.emailVerified = true;
    user.otp = undefined;
    await user.save();

    // Create session after verification
    req.session.userId = user._id.toString();
    req.session.role = user.role;

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Email verified successfully",
      body: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        emailVerified: true,
        role: user.role,
      },
    });
  },
);

// Resend OTP
export const resendOTP = tryCatchWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return sendTsRestError(res, 400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendTsRestError(res, 404, "User not found");
    }

    if (user.emailVerified) {
      return sendTsRestError(res, 400, "Email already verified");
    }

    // Rate limit: max 1 per 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    if (user.otpLastSentAt && user.otpLastSentAt > twoMinutesAgo) {
      const retryAfter = Math.ceil(
        (user.otpLastSentAt.getTime() + 2 * 60 * 1000 - Date.now()) / 1000,
      );
      return sendTsRestError(
        res,
        429,
        `Please wait ${retryAfter} seconds before requesting a new OTP.`,
      );
    }

    // Generate new OTP
    const otp = emailService.generateOTP();
    const expiresAt = emailService.getOtpExpiry();

    user.otp = {
      code: otp,
      expiresAt,
      attempts: 0,
    };
    user.otpLastSentAt = new Date();
    await user.save();

    // Send email (fire-and-forget)
    emailService
      .sendVerificationEmail({ user, otp, link: verifyEmailLink })
      .catch((err) => {
        logger.error(
          { err, userId: user._id },
          "Failed to resend verification email",
        );
      });

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  },
);

export const loginUser = tryCatchWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendTsRestError(res, 400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password").lean();
    if (!user) {
      return sendTsRestError(res, 400, "Account not found");
    }

    // Check if email verified
    if (!user.emailVerified) {
      return sendTsRestError(
        res,
        403,
        "Please verify your email before logging in.",
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return sendTsRestError(res, 401, "Incorrect credentials");
    }

    // Create session
    req.session.userId = user._id.toString();
    req.session.role = user.role;

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Login successful",
      body: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  },
);

export const getUser = tryCatchWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      return sendTsRestError(res, 404, "User not found");
    }
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "User found",
      body: user,
    });
  },
);

export const logoutUser = tryCatchWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    req.session.destroy((err) => {
      if (err) {
        return sendTsRestError(res, 500, "Failed to logout");
      }
      return sendTsRestSuccess(res, 200, {
        success: true,
        message: "Logout successful",
      });
    });
  },
);

export const requestForgotPassword = tryCatchWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return sendTsRestError(res, 400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendTsRestError(res, 404, "Account not found");
    }

    // Generate OTP
    const otp = emailService.generateOTP();
    const otpExpiry = emailService.getOtpExpiry();

    // Update user with OTP
    user.otp = {
      code: otp,
      expiresAt: otpExpiry,
      attempts: 0,
    };
    user.otpLastSentAt = new Date();
    await user.save();
    const resetPasswordLink = `${env.CLIENT_URL}/reset-password?email=${email}`;
    // Send email (fire-and-forget)
    emailService.sendForgotPasswordEmail({ user, otp, link: resetPasswordLink }).catch((err) => {
      logger.error(
        { err, userId: user._id },
        "Failed to send forgot password email",
      );
    });

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  },
);

export const resetPassword = tryCatchWrapper(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { otp, newPassword } = req.body;
    const email = req.query.email as string;

    if (!email || !otp || !newPassword) {
      return sendTsRestError(
        res,
        400,
        "Email, OTP, and new password are required",
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendTsRestError(res, 404, "Account not found");
    }

    // Verify OTP
    if (!user.otp || user.otp.code !== otp) {
      return sendTsRestError(res, 400, "Invalid OTP");
    }

    if (user.otp.expiresAt < new Date()) {
      return sendTsRestError(res, 400, "OTP has expired");
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    await user.save();

    // Send password reset success email (fire-and-forget)
    emailService.sendPasswordResetSuccessEmail({ user }).catch((err) => {
      logger.error(
        { err, userId: user._id },
        "Failed to send password reset success email",
      );
    });

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Password reset successfully",
    });
  },
);
