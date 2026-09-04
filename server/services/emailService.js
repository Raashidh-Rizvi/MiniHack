const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    const user = process.env.MAIL_USERNAME || '';
    const pass = (process.env.MAIL_PASSWORD || '').replace(/\s+/g, '');
    const host = process.env.MAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.MAIL_PORT) || 587;

    if (user && pass) {
      if (user.endsWith('@gmail.com') || host.includes('gmail')) {
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass },
        });
      } else {
        transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
      }
    }
  }
  return transporter;
}

/**
 * Send an OTP verification email to the user.
 * @param {string} toEmail Recipient email address
 * @param {string} otp 6-digit verification code
 */
async function sendOtpEmail(toEmail, otp) {
  const mailClient = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 520px; margin: 0 auto; background: #1e293b; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); padding: 36px; text-align: center; }
        .logo { font-size: 26px; font-weight: 800; color: #ef4444; letter-spacing: -0.5px; margin-bottom: 8px; }
        .subtitle { font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 24px; }
        .heading { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
        .desc { font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 28px; }
        .otp-box { background: rgba(239, 68, 68, 0.1); border: 2px dashed #ef4444; border-radius: 16px; padding: 20px 24px; display: inline-block; margin-bottom: 24px; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #ef4444; }
        .note { font-size: 12px; color: #94a3b8; line-height: 1.5; }
        .footer { margin-top: 32px; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">GramaFix</div>
        <div class="subtitle">Civic Governance & Hazard Resolution</div>
        <div class="heading">Verify Your Citizen Account</div>
        <p class="desc">
          Thank you for joining GramaFix. Enter the 6-digit verification code below to complete your citizen registration.
        </p>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>
        <p class="note">
          This verification code expires in <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
        <div class="footer">
          Sri Lanka Municipal Civic Tech Network • Automated System Dispatch
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `GramaFix Citizen Verification\n\nYour 6-digit verification code is: ${otp}\n\nThis code expires in 10 minutes. Enter it to complete your citizen account registration.`;

  console.log(`[EMAIL DISPATCH] Dispatching OTP ${otp} to email ${toEmail}`);

  if (mailClient) {
    try {
      const fromAddress = process.env.MAIL_USERNAME || 'noreply@gramafix.lk';
      const info = await mailClient.sendMail({
        from: `"GramaFix Verification" <${fromAddress}>`,
        to: toEmail,
        subject: `${otp} is your GramaFix Citizen Verification Code`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[EMAIL DISPATCH] Email sent successfully. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[EMAIL DISPATCH ERROR] Failed to send email: ${err.message}`);
      return { success: false, error: err.message };
    }
  } else {
    console.warn(`[EMAIL DISPATCH] No SMTP credentials configured. Simulated OTP dispatch: ${otp}`);
    return { success: true, simulated: true };
  }
}

module.exports = { sendOtpEmail };
