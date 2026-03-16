import nodemailer from "nodemailer";

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

interface ApplicationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    productDetails: string;
}

export async function sendApplicationEmail(data: ApplicationData) {
    try {
        const receiver = process.env.MAIL_RECEIVER || "koushiksarkar741777@gmail.com";

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Barcode Application System" <${process.env.MAIL_USER}>`, // sender address
            to: receiver, // list of receivers
            subject: `New Barcode Application: ${data.companyName}`, // Subject line
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: #2563eb; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .field { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .label { font-weight: bold; color: #555; display: block; margin-bottom: 5px; }
            .value { font-size: 16px; color: #000; }
            .footer { background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0;">New Barcode Application</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Company / Brand Name</span>
                <span class="value">${data.companyName}</span>
              </div>
              
              <h3 style="color: #2563eb; margin-top: 25px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Applicant Details</h3>
              
              <div class="field">
                <span class="label">Full Name</span>
                <span class="value">${data.firstName} ${data.lastName}</span>
              </div>
              <div class="field">
                <span class="label">Email Address</span>
                <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
              </div>
              <div class="field">
                <span class="label">Phone Number</span>
                <span class="value"><a href="tel:${data.phone}">${data.phone}</a></span>
              </div>

              <h3 style="color: #2563eb; margin-top: 25px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Product Information</h3>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0;">
                <span class="label">Product details / Requirements:</span>
                <p style="margin-top: 5px; white-space: pre-wrap;">${data.productDetails}</p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from your Barcode Application System.</p>
              <p>&copy; ${new Date().getFullYear()} Barcode System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

export async function sendOtpEmail(email: string, username: string, otp: string) {
    try {
        await transporter.sendMail({
            from: `"ShopMyBarcode" <${process.env.MAIL_USER}>`,
            to: email,
            subject: `Your Password Reset OTP – ShopMyBarcode`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #0a0f1a; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 30px auto; background: #141e2d; border-radius: 12px; overflow: hidden; border: 1px solid rgba(250,146,82,0.3); }
            .header { background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; text-align: center; }
            .header h2 { margin: 0; color: #fff; font-size: 22px; }
            .content { padding: 32px; color: #e0e0e0; }
            .otp-box { background: rgba(250,146,82,0.15); border: 2px solid rgba(250,146,82,0.5); border-radius: 8px; text-align: center; padding: 20px; margin: 24px 0; }
            .otp { font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #fb923c; }
            .note { font-size: 13px; color: #9ca3af; margin-top: 16px; }
            .footer { padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid rgba(250,146,82,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h2>🔐 Password Reset OTP</h2></div>
            <div class="content">
              <p>Hi <strong>${username}</strong>,</p>
              <p>We received a request to reset your password. Use the OTP below:</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
              </div>
              <p class="note">⏱ This OTP expires in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">© ${new Date().getFullYear()} ShopMyBarcode. All rights reserved.</div>
          </div>
        </body>
        </html>
      `,
        });
        return true;
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return false;
    }
}

export async function sendVerificationEmail(email: string, username: string, token: string) {
    try {
        const baseUrl = process.env.APP_URL || 'https://shopmybarcode.in';
        const verifyLink = `${baseUrl}/verify-email?token=${token}`;

        await transporter.sendMail({
            from: `"ShopMyBarcode" <${process.env.MAIL_USER}>`,
            to: email,
            subject: `Verify your email – ShopMyBarcode`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #0a0f1a; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 30px auto; background: #141e2d; border-radius: 12px; overflow: hidden; border: 1px solid rgba(250,146,82,0.3); }
            .header { background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; text-align: center; }
            .header h2 { margin: 0; color: #fff; font-size: 22px; }
            .content { padding: 32px; color: #e0e0e0; }
            .btn { display: block; width: fit-content; margin: 24px auto; padding: 14px 32px; background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
            .note { font-size: 13px; color: #9ca3af; margin-top: 16px; }
            .footer { padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid rgba(250,146,82,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h2>✅ Verify Your Email</h2></div>
            <div class="content">
              <p>Hi <strong>${username}</strong>,</p>
              <p>Welcome to ShopMyBarcode! Please click the button below to verify your email address and activate your account.</p>
              <a href="${verifyLink}" class="btn">Verify Email</a>
              <p class="note">If the button doesn't work, copy and paste this link:<br/><a href="${verifyLink}" style="color:#fb923c;word-break:break-all;">${verifyLink}</a></p>
              <p class="note">⏱ This link expires in <strong>24 hours</strong>. If you did not sign up, please ignore this email.</p>
            </div>
            <div class="footer">© ${new Date().getFullYear()} ShopMyBarcode. All rights reserved.</div>
          </div>
        </body>
        </html>
      `,
        });
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false;
    }
}
