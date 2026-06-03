export const verifyAccountTemplate = (
  name: string,
  otp: string,
  link: string,
) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Verify Your Email - MILES</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f0f2f5;
            -webkit-font-smoothing: antialiased;
          }

          .wrapper {
            width: 100%;
            background-color: #f0f2f5;
            padding: 48px 24px;
          }

          .container {
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }

          .brand-bar {
            height: 6px;
            background: linear-gradient(90deg, #007cbe, #00a5e0, #007cbe);
          }

          .inner {
            padding: 48px 40px 40px;
          }

          .logo {
            font-size: 22px;
            font-weight: 700;
            color: #007cbe;
            letter-spacing: -0.02em;
            margin-bottom: 36px;
          }

          .greeting {
            font-size: 15px;
            color: #6b7280;
            margin-bottom: 8px;
          }

          .heading {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
            line-height: 1.3;
          }

          .body-text {
            font-size: 15px;
            line-height: 1.7;
            color: #4b5563;
            margin-bottom: 32px;
          }

          .otp-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 28px 24px;
            text-align: center;
            margin-bottom: 32px;
          }

          .otp-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #94a3b8;
            margin-bottom: 16px;
          }

          .otp-digits {
            display: inline-block;
          }

          .otp-digit {
            display: inline-block;
            width: 44px;
            height: 52px;
            line-height: 52px;
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            color: #007cbe;
            background-color: #ffffff;
            border: 1.5px solid #d1d5db;
            border-radius: 10px;
            margin: 0 3px;
          }

          .expiry {
            font-size: 13px;
            color: #9ca3af;
            margin-top: 16px;
          }

          .note {
            font-size: 13px;
            color: #9ca3af;
            line-height: 1.6;
            padding-top: 24px;
            border-top: 1px solid #f3f4f6;
          }

          .footer {
            padding: 24px 40px;
            background-color: #f8fafc;
            border-top: 1px solid #f3f4f6;
            text-align: center;
          }

          .footer-text {
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.6;
          }

          .footer-link {
            color: #007cbe;
            text-decoration: none;
            font-weight: 500;
          }

          @media only screen and (max-width: 560px) {
            .inner { padding: 36px 24px 32px; }
            .footer { padding: 20px 24px; }
            .otp-digit { width: 38px; height: 46px; line-height: 46px; font-size: 20px; margin: 0 2px; }
            .heading { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="brand-bar"></div>
            <div class="inner">
              <div class="logo">MILES</div>
              <p class="greeting">Hey ${name},</p>
              <h1 class="heading">Verify your email address</h1>
              <p class="body-text">
                Thanks for signing up. Use the code below to complete your registration and start riding with MILES.
              </p>
              <div class="otp-box">
                <p class="otp-label">Your verification code</p>
                <div class="otp-digits">
                  ${otp
                    .split("")
                    .map((d: string) => `<span class="otp-digit">${d}</span>`)
                    .join("")}
                </div>
                <p class="expiry">Expires in 15 minutes</p>
                <p class="note">
                  Click the link below to verify your account using the code above.
                  <a href="${link}" class="footer-link">Verify Account</a>
                </p>
              </div>
              <p class="note">
                Didn't create an account? You can safely ignore this email — no action is needed on your part.
              </p>
            </div>
            <div class="footer">
              <p class="footer-text">
                <a href="#" class="footer-link">Help Center</a> &nbsp;·&nbsp;
                <a href="#" class="footer-link">Privacy</a> &nbsp;·&nbsp;
                <a href="#" class="footer-link">Terms</a>
              </p>
              <p class="footer-text" style="margin-top: 8px;">© ${new Date().getFullYear()} MILES. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

export const requestForgotPasswordTemplate = (
  name: string,
  otp: string,
  link: string,
) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Reset Your Password - MILES</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #f0f2f5;
              -webkit-font-smoothing: antialiased;
            }

            .wrapper {
              width: 100%;
              background-color: #f0f2f5;
              padding: 48px 24px;
            }

            .container {
              max-width: 520px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              border: 1px solid #e5e7eb;
            }

            .brand-bar {
              height: 6px;
              background: linear-gradient(90deg, #007cbe, #00a5e0, #007cbe);
            }

            .inner {
              padding: 48px 40px 40px;
            }

            .logo {
              font-size: 22px;
              font-weight: 700;
              color: #007cbe;
              letter-spacing: -0.02em;
              margin-bottom: 36px;
            }

            .greeting {
              font-size: 15px;
              color: #6b7280;
              margin-bottom: 8px;
            }

            .heading {
              font-size: 22px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 16px;
              line-height: 1.3;
            }

            .body-text {
              font-size: 15px;
              line-height: 1.7;
              color: #4b5563;
              margin-bottom: 32px;
            }

            .otp-box {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 28px 24px;
              text-align: center;
              margin-bottom: 32px;
            }

            .otp-label {
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #94a3b8;
              margin-bottom: 16px;
            }

            .otp-digits {
              display: inline-block;
            }

            .otp-digit {
              display: inline-block;
              width: 44px;
              height: 52px;
              line-height: 52px;
              text-align: center;
              font-size: 24px;
              font-weight: 700;
              color: #007cbe;
              background-color: #ffffff;
              border: 1.5px solid #d1d5db;
              border-radius: 10px;
              margin: 0 3px;
            }

            .expiry {
              font-size: 13px;
              color: #9ca3af;
              margin-top: 16px;
            }

            .note {
              font-size: 13px;
              color: #9ca3af;
              line-height: 1.6;
              padding-top: 24px;
              border-top: 1px solid #f3f4f6;
            }

            .footer {
              padding: 24px 40px;
              background-color: #f8fafc;
              border-top: 1px solid #f3f4f6;
              text-align: center;
            }

            .footer-text {
              font-size: 12px;
              color: #9ca3af;
              line-height: 1.6;
            }

            .footer-link {
              color: #007cbe;
              text-decoration: none;
              font-weight: 500;
            }

            @media only screen and (max-width: 560px) {
              .inner { padding: 36px 24px 32px; }
              .footer { padding: 20px 24px; }
              .otp-digit { width: 38px; height: 46px; line-height: 46px; font-size: 20px; margin: 0 2px; }
              .heading { font-size: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="brand-bar"></div>
              <div class="inner">
                <div class="logo">MILES</div>
                <p class="greeting">Hey ${name},</p>
                <h1 class="heading">Reset your password</h1>
                <p class="body-text">
                  We received a request to reset your password. Use the code below to complete the process.
                </p>
                <div class="otp-box">
                  <p class="otp-label">Your reset code</p>
                  <div class="otp-digits">
                    ${otp
                      .split("")
                      .map((d: string) => `<span class="otp-digit">${d}</span>`)
                      .join("")}
                  </div>
                  <p class="expiry">Expires in 15 minutes</p>
                   <p class="note">
                  Click the link below to verify your account using the code above.
                  <a href="${link}" class="footer-link">Verify Account</a>
                </p>
                </div>
                <p class="note">
                  Didn't request a password reset? You can safely ignore this email — no action is needed on your part.
                </p>
              </div>
              <div class="footer">
                <p class="footer-text">
                  <a href="#" class="footer-link">Help Center</a> &nbsp;·&nbsp;
                  <a href="#" class="footer-link">Privacy</a> &nbsp;·&nbsp;
                  <a href="#" class="footer-link">Terms</a>
                </p>
                <p class="footer-text" style="margin-top: 8px;">© ${new Date().getFullYear()} MILES. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

export const passwordResetSuccessTemplate = (name: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Password Reset Successful - MILES</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f0f2f5;
            -webkit-font-smoothing: antialiased;
          }

          .wrapper {
            width: 100%;
            background-color: #f0f2f5;
            padding: 48px 24px;
          }

          .container {
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }

          .brand-bar {
            height: 6px;
            background: linear-gradient(90deg, #007cbe, #00a5e0, #007cbe);
          }

          .inner {
            padding: 48px 40px 40px;
          }

          .logo {
            font-size: 22px;
            font-weight: 700;
            color: #007cbe;
            letter-spacing: -0.02em;
            margin-bottom: 36px;
          }

          .greeting {
            font-size: 15px;
            color: #6b7280;
            margin-bottom: 8px;
          }

          .heading {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
            line-height: 1.3;
          }

          .body-text {
            font-size: 15px;
            line-height: 1.7;
            color: #4b5563;
            margin-bottom: 32px;
          }

          .checkmark {
            display: inline-block;
            width: 64px;
            height: 64px;
            margin: 0 auto 24px;
            background-color: #dcfce7;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .checkmark svg {
            width: 32px;
            height: 32px;
            color: #16a34a;
          }

          .note {
            font-size: 13px;
            color: #9ca3af;
            line-height: 1.6;
            padding-top: 24px;
            border-top: 1px solid #f3f4f6;
          }

          .footer {
            padding: 24px 40px;
            background-color: #f8fafc;
            border-top: 1px solid #f3f4f6;
            text-align: center;
          }

          .footer-text {
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.6;
          }

          .footer-link {
            color: #007cbe;
            text-decoration: none;
            font-weight: 500;
          }

          @media only screen and (max-width: 560px) {
            .inner { padding: 36px 24px 32px; }
            .footer { padding: 20px 24px; }
            .heading { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="brand-bar"></div>
            <div class="inner">
              <div class="logo">MILES</div>
              <p class="greeting">Hey ${name},</p>
              <h1 class="heading">Password Reset Successful</h1>
              <p class="body-text">
                Your password has been successfully updated. You can now use your new password to log in.
              </p>
              <div class="checkmark">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p class="note">
                If you didn't make this change, please contact our support team immediately.
              </p>
            </div>
            <div class="footer">
              <p class="footer-text">
                <a href="#" class="footer-link">Help Center</a> &nbsp;·&nbsp;
                <a href="#" class="footer-link">Privacy</a> &nbsp;·&nbsp;
                <a href="#" class="footer-link">Terms</a>
              </p>
              <p class="footer-text" style="margin-top: 8px;">© ${new Date().getFullYear()} MILES. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const paymentConfirmationTemplate = (
  name: string,
  amount: string,
  reference: string,
  paymentMethod: string,
  paidAt: string,
) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Payment Confirmed - MILES</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f0f2f5;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f0f2f5;
          padding: 48px 24px;
        }
        .container {
          max-width: 520px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .brand-bar {
          height: 6px;
          background: linear-gradient(90deg, #007cbe, #00a5e0, #007cbe);
        }
        .inner {
          padding: 48px 40px 40px;
        }
        .logo {
          font-size: 22px;
          font-weight: 700;
          color: #007cbe;
          letter-spacing: -0.02em;
          margin-bottom: 36px;
        }
        .greeting {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .heading {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        .body-text {
          font-size: 15px;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 32px;
        }
        .checkmark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          background-color: #dcfce7;
          border-radius: 50%;
        }
        .checkmark svg {
          width: 32px;
          height: 32px;
          color: #16a34a;
        }
        .detail-card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .detail-row:last-child {
          margin-bottom: 0;
        }
        .detail-label {
          font-size: 13px;
          color: #6b7280;
        }
        .detail-value {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }
        .amount-highlight {
          font-size: 20px;
          font-weight: 700;
          color: #16a34a;
          text-align: center;
          margin: 8px 0 16px;
        }
        .note {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.6;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
        }
        .footer {
          padding: 24px 40px;
          background-color: #f8fafc;
          border-top: 1px solid #f3f4f6;
          text-align: center;
        }
        .footer-text {
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.6;
        }
        .footer-link {
          color: #007cbe;
          text-decoration: none;
          font-weight: 500;
        }
        @media only screen and (max-width: 560px) {
          .inner { padding: 36px 24px 32px; }
          .footer { padding: 20px 24px; }
          .heading { font-size: 20px; }
          .detail-card { padding: 16px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="brand-bar"></div>
          <div class="inner">
            <div class="logo">MILES</div>
            <div class="checkmark">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="greeting">Hey ${name},</p>
            <h1 class="heading">Payment Confirmed</h1>
            <p class="body-text">
              Your payment has been received and confirmed. Here are the details:
            </p>
            <p class="amount-highlight">${amount}</p>
            <div class="detail-card">
              <div class="detail-row">
                <span class="detail-label">Reference</span>
                <span class="detail-value">${reference}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Method</span>
                <span class="detail-value">${paymentMethod}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${paidAt}</span>
              </div>
            </div>
            <p class="note">
              If you did not authorize this payment, please contact our support team immediately.
            </p>
          </div>
          <div class="footer">
            <p class="footer-text">
              <a href="#" class="footer-link">Help Center</a> &nbsp;·&nbsp;
              <a href="#" class="footer-link">Privacy</a> &nbsp;·&nbsp;
              <a href="#" class="footer-link">Terms</a>
            </p>
            <p class="footer-text" style="margin-top: 8px;">© ${new Date().getFullYear()} MILES. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const contactOwnerTemplate = (
  fullname: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Contact Message - MILES</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f0f2f5;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f0f2f5;
          padding: 48px 24px;
        }
        .container {
          max-width: 560px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .brand-bar {
          height: 6px;
          background: linear-gradient(90deg, #007cbe, #00a5e0, #007cbe);
        }
        .inner {
          padding: 40px 40px 36px;
        }
        .logo {
          font-size: 22px;
          font-weight: 700;
          color: #007cbe;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
        }
        .heading {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 24px;
          line-height: 1.3;
        }
        .field {
          margin-bottom: 16px;
        }
        .field-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .field-value {
          font-size: 15px;
          color: #1f2937;
          line-height: 1.5;
        }
        .message-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-top: 8px;
        }
        .message-text {
          font-size: 15px;
          line-height: 1.7;
          color: #374151;
          white-space: pre-wrap;
        }
        .divider {
          height: 1px;
          background-color: #f3f4f6;
          margin: 24px 0;
        }
        .reply-hint {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
        }
        .reply-link {
          color: #007cbe;
          text-decoration: none;
          font-weight: 500;
        }
        .footer {
          padding: 24px 40px;
          background-color: #f8fafc;
          border-top: 1px solid #f3f4f6;
          text-align: center;
        }
        .footer-text {
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.6;
        }
        @media only screen and (max-width: 560px) {
          .inner { padding: 32px 24px 28px; }
          .footer { padding: 20px 24px; }
          .heading { font-size: 18px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="brand-bar"></div>
          <div class="inner">
            <div class="logo">MILES</div>
            <h1 class="heading">New Contact Message</h1>
            <div class="field">
              <p class="field-label">From</p>
              <p class="field-value">${fullname}</p>
            </div>
            <div class="field">
              <p class="field-label">Email</p>
              <p class="field-value"><a href="mailto:${email}" class="reply-link">${email}</a></p>
            </div>
            <div class="field">
              <p class="field-label">Phone</p>
              <p class="field-value">${phone || "Not provided"}</p>
            </div>
            <div class="field">
              <p class="field-label">Subject</p>
              <p class="field-value">${subject}</p>
            </div>
            <div class="divider"></div>
            <div class="message-box">
              <p class="message-text">${message}</p>
            </div>
            <div class="divider"></div>
            <p class="reply-hint">
              Reply directly to this client at <a href="mailto:${email}" class="reply-link">${email}</a>
            </p>
          </div>
          <div class="footer">
            <p class="footer-text">© ${new Date().getFullYear()} MILES. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const bookingConfirmationTemplate = (
  name: string,
  carName: string,
  carType: string,
  pickUpLocation: string,
  dropOffLocation: string,
  pickUpDate: string,
  dropOffDate: string,
  pickUpTime: string,
  dropOffTime: string,
  rentalTotal: string,
  serviceFee: string,
  grandTotal: string,
  addDriver: boolean,
) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Booking Confirmed - MILES</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f0f2f5;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f0f2f5;
          padding: 48px 24px;
        }
        .container {
          max-width: 560px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .brand-bar {
          height: 6px;
          background: linear-gradient(90deg, #007cbe, #00a5e0, #007cbe);
        }
        .inner {
          padding: 48px 40px 40px;
        }
        .logo {
          font-size: 22px;
          font-weight: 700;
          color: #007cbe;
          letter-spacing: -0.02em;
          margin-bottom: 36px;
        }
        .greeting {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .heading {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        .body-text {
          font-size: 15px;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 32px;
        }
        .checkmark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          background-color: #dcfce7;
          border-radius: 50%;
        }
        .checkmark svg {
          width: 32px;
          height: 32px;
          color: #16a34a;
        }
        .detail-card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .detail-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .detail-row:last-child {
          margin-bottom: 0;
        }
        .detail-label {
          font-size: 13px;
          color: #6b7280;
        }
        .detail-value {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          text-align: right;
        }
        .divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 16px 0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        .total-label {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }
        .total-value {
          font-size: 16px;
          font-weight: 700;
          color: #007cbe;
        }
        .driver-badge {
          display: inline-block;
          background-color: #dbeafe;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          margin-top: 8px;
        }
        .note {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.6;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
        }
        .footer {
          padding: 24px 40px;
          background-color: #f8fafc;
          border-top: 1px solid #f3f4f6;
          text-align: center;
        }
        .footer-text {
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.6;
        }
        .footer-link {
          color: #007cbe;
          text-decoration: none;
          font-weight: 500;
        }
        @media only screen and (max-width: 560px) {
          .inner { padding: 36px 24px 32px; }
          .footer { padding: 20px 24px; }
          .heading { font-size: 20px; }
          .detail-card { padding: 16px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="brand-bar"></div>
          <div class="inner">
            <div class="logo">MILES</div>
            <div class="checkmark">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="greeting">Hey ${name},</p>
            <h1 class="heading">Booking Confirmed!</h1>
            <p class="body-text">
              Your car rental has been booked successfully. Here are your booking details:
            </p>
            <div class="detail-card">
              <p class="detail-card-title">Vehicle</p>
              <div class="detail-row">
                <span class="detail-label">Car</span>
                <span class="detail-value">${carName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">${carType}</span>
              </div>
              ${addDriver ? '<span class="driver-badge">Driver Included</span>' : ''}
            </div>
            <div class="detail-card">
              <p class="detail-card-title">Trip Details</p>
              <div class="detail-row">
                <span class="detail-label">Pickup</span>
                <span class="detail-value">${pickUpLocation}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Drop-off</span>
                <span class="detail-value">${dropOffLocation}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pickup Date</span>
                <span class="detail-value">${pickUpDate} · ${pickUpTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Drop-off Date</span>
                <span class="detail-value">${dropOffDate} · ${dropOffTime}</span>
              </div>
            </div>
            <div class="detail-card">
              <p class="detail-card-title">Payment Summary</p>
              <div class="detail-row">
                <span class="detail-label">Rental Total</span>
                <span class="detail-value">${rentalTotal}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service Fee</span>
                <span class="detail-value">${serviceFee}</span>
              </div>
              <div class="divider"></div>
              <div class="total-row">
                <span class="total-label">Grand Total</span>
                <span class="total-value">${grandTotal}</span>
              </div>
            </div>
            <p class="note">
              Free cancellation up to 24 hours before pickup. If you have any questions, please contact our support team.
            </p>
          </div>
          <div class="footer">
            <p class="footer-text">
              <a href="#" class="footer-link">Help Center</a> &nbsp;·&nbsp;
              <a href="#" class="footer-link">Privacy</a> &nbsp;·&nbsp;
              <a href="#" class="footer-link">Terms</a>
            </p>
            <p class="footer-text" style="margin-top: 8px;">© ${new Date().getFullYear()} MILES. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const contactUsTemplate = (name: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Contact Us - MILES</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f7fa;
            color: #1f2937;
          }
          .wrapper {
            background-color: #f5f7fa;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          .brand-bar {
            height: 4px;
            background-color: #007cbe;
          }
          .inner {
            padding: 40px 48px;
          }
          .logo {
            font-size: 28px;
            font-weight: 700;
            color: #007cbe;
            margin-bottom: 24px;
          }
          .greeting {
            font-size: 16px;
            color: #374151;
            margin: 0 0 16px 0;
          }
          .heading {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 24px 0;
          }
          .body-text {
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
            margin: 0 0 24px 0;
          }
          .note {
            font-size: 14px;
            color: #6b7280;
            margin: 0 0 24px 0;
          }
          .footer {
            padding: 24px 48px;
            background-color: #f8fafc;
            border-top: 1px solid #f3f4f6;
            text-align: center;
          }
          .footer-text {
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.6;
          }
          .footer-link {
            color: #007cbe;
            text-decoration: none;
            font-weight: 500;
          }
          @media only screen and (max-width: 560px) {
            .inner { padding: 36px 24px 32px; }
            .footer { padding: 20px 24px; }
            .heading { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="brand-bar"></div>
            <div class="inner">
              <div class="logo">MILES</div>
              <p class="greeting">Hey ${name},</p>
              <h1 class="heading">Thank You for Reaching Out</h1>
              <p class="body-text">
                We've received your message and our team will get back to you as soon as possible.
              </p>
              <p class="note">
                If you need immediate assistance, please feel free to call us at +234 800 000 0000.
              </p>
            </div>
            <div class="footer">
              <p class="footer-text">
                <a href="#" class="footer-link">Help Center</a> &nbsp;·&nbsp;
                <a href="#" class="footer-link">Privacy</a> &nbsp;·&nbsp;
                <a href="#" class="footer-link">Terms</a>
              </p>
              <p class="footer-text" style="margin-top: 8px;">© ${new Date().getFullYear()} MILES. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
