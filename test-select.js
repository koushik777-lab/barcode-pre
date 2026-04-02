import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const barcodeSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
});

const Barcode = mongoose.model('Barcode', barcodeSchema);

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/barcode_db';
  await mongoose.connect(uri);
  const start = Date.now();
  console.log("Fetching minimal data...");
  const barcodes = await Barcode.find().select('barcode').lean();
  console.log("Fetched in", Date.now() - start, "ms. Count:", barcodes.length);
  process.exit(0);
}
run();
