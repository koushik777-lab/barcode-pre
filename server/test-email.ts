import nodemailer from "nodemailer";
import "dotenv/config";

async function testConnection() {
  console.log("Testing SMTP Connection...");
  console.log("User:", process.env.MAIL_USER);
  
  // Use explicit settings instead of "service" for better debugging
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    console.log("Attempting to verify connection...");
    const success = await transporter.verify();
    if (success) {
      console.log("✅ SMTP Connection verified successfully!");
    }
  } catch (error: any) {
    console.error("❌ SMTP Connection failed:");
    console.error("Error Code:", error.code);
    console.error("Response:", error.response);
    if (error.responseCode) console.error("Response Code:", error.responseCode);
    console.error("\nFull Error details:", error.message);
    
    if (error.responseCode === 535 || error.code === 'EAUTH') {
      console.log("\n💡 Possible solutions:");
      console.log("1. Ensure 2-Step Verification is enabled on your Google account.");
      console.log("2. Generate a NEW App Password and use it in your .env file.");
      console.log("3. Remove spaces from the App Password in .env (e.g., 'abcd efgh ijkl mnop' -> 'abcdefghijklmnop').");
      console.log("4. Ensure MAIL_USER in .env matches the email that generated the App Password.");
    }
  }
}

testConnection();
