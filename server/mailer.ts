import "dotenv/config";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";


// Create reusable transporter object using the default SMTP transport
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn("MAIL_USER or MAIL_PASS is missing in environment variables. Email services may not function.");
}

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Verify connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter verify error:", error);
    } else {
        console.log("Transporter is ready to take messages");
    }
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
        const receiver = process.env.MAIL_RECEIVER || "shopmybarcode9@gmail.com";
        const sender = process.env.MAIL_USER || "shopmybarcode9@gmail.com";

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"ShopMyBarcode" <${sender}>`, // sender address
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
        const currentDir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : path.dirname(new URL(import.meta.url).pathname);
        let logoPath = path.resolve(currentDir, "../client/public/new_logo.jpeg");
        if (!fs.existsSync(logoPath)) {
            logoPath = path.resolve(currentDir, "./public/new_logo.jpeg");
        }
        if (!fs.existsSync(logoPath)) {
            logoPath = path.resolve(process.cwd(), "client/public/new_logo.jpeg");
        }

        const sender = process.env.MAIL_USER || "shopmybarcode9@gmail.com";

        const info = await transporter.sendMail({
            from: `"ShopMyBarcode" <${sender}>`,
            to: email,
            subject: `Your Password Reset OTP – ShopMyBarcode`,
            attachments: [{
                content: fs.readFileSync(logoPath),
                cid: 'logo',
                contentDisposition: 'inline',
                filename: 'logo'
            }],
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
            .wrapper { width: 100%; padding: 40px 0; background-color: #f8fafc; }
            .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { padding: 40px 32px 20px; text-align: center; }
            .logo { height: 50px; width: auto; margin-bottom: 24px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05)); }
            .header h2 { margin: 0; color: #0f172a; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 10px 40px 40px; color: #334155; font-size: 16px; line-height: 1.6; text-align: center; }
            .otp-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; margin: 30px 0; box-shadow: inset 0 0 10px rgba(249, 115, 22, 0.05); }
            .otp { font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #f97316; margin: 0; padding-left: 12px; }
            .note { font-size: 14px; color: #64748b; margin-top: 30px; line-height: 1.5; padding: 20px; background: #f1f5f9; border-radius: 8px; border: 1px solid #e2e8f0; }
            .footer { padding: 24px; text-align: center; font-size: 13px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <img src="cid:logo" alt="ShopMyBarcode Logo" class="logo" />
                <h2>Password Reset OTP</h2>
              </div>
              <div class="content">
                <p>Hi <strong style="color: #0f172a;">${username}</strong>,</p>
                <p>We received a request to reset your password. Use the secure OTP below to proceed:</p>
                <div class="otp-box">
                  <div class="otp">${otp}</div>
                </div>
                <div class="note">
                  This OTP expires securely in <strong>10 minutes</strong>. If you did not request this password reset, please ignore this email.
                </div>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} ShopMyBarcode. All rights reserved.
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
        });
        console.log("OTP email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return false;
    }
}

export async function sendVerificationEmail(email: string, username: string, token: string) {
    try {
        console.log(`Attempting to send verification email to: ${email}`);
        const baseUrl = process.env.APP_URL || 'http://localhost:5001';
        const verifyLink = `${baseUrl}/verify-email?token=${token}`;
        
        const currentDir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : path.dirname(new URL(import.meta.url).pathname);
        let logoPath = path.resolve(currentDir, "../client/public/new_logo.jpeg");
        if (!fs.existsSync(logoPath)) {
            logoPath = path.resolve(currentDir, "./public/new_logo.jpeg");
        }
        if (!fs.existsSync(logoPath)) {
            logoPath = path.resolve(process.cwd(), "client/public/new_logo.jpeg");
        }

        const sender = process.env.MAIL_USER || "shopmybarcode9@gmail.com";

        const info = await transporter.sendMail({
            from: `"ShopMyBarcode" <${sender}>`, // Unified from name
            to: email,
            subject: `Verify your email – ShopMyBarcode`,
            attachments: [{
                content: fs.readFileSync(logoPath),
                cid: 'logo',
                contentDisposition: 'inline',
            }],
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
            .wrapper { width: 100%; padding: 40px 0; background-color: #f8fafc; }
            .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { padding: 40px 32px 20px; text-align: center; }
            .logo { height: 50px; width: auto; margin-bottom: 24px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05)); }
            .header h2 { margin: 0; color: #0f172a; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 10px 40px 40px; color: #334155; font-size: 16px; line-height: 1.6; text-align: center; }
            .btn-wrapper { margin: 35px 0; }
            .btn { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316, #ea580c); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4); text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.1); }
            .note { font-size: 14px; color: #64748b; margin-top: 30px; line-height: 1.5; padding: 20px; background: #f1f5f9; border-radius: 8px; border: 1px solid #e2e8f0; }
            .link { color: #f97316; word-break: break-all; text-decoration: none; }
            .footer { padding: 24px; text-align: center; font-size: 13px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <img src="cid:logo" alt="ShopMyBarcode Logo" class="logo" />
                <h2>Verify Your Email</h2>
              </div>
              <div class="content">
                <p>Hi <strong style="color: #0f172a;">${username}</strong>,</p>
                <p>Welcome to ShopMyBarcode! Please click the button below to verify your email address and activate your account.</p>
                
                <div class="btn-wrapper">
                  <a href="${verifyLink}" class="btn">Verify Email</a>
                </div>
                
                <div class="note">
                  If the button doesn't work, copy and paste this secure link:<br/>
                  <a href="${verifyLink}" class="link">${verifyLink}</a><br/><br/>
                  This link will expire securely in <strong>24 hours</strong>. If you did not sign up, please disregard this email.
                </div>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} ShopMyBarcode. All rights reserved.
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
        });
        console.log("Verification email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false;
    }
}
