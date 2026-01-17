import nodemailer from "nodemailer";

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // generated ethereal password
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
