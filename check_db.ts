import mongoose from 'mongoose';
import { Barcode } from './server/models.ts';
import dotenv from 'dotenv';

dotenv.config();

async function checkDB() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/live_barcode');
    const total = await Barcode.countDocuments();
    const live = await Barcode.countDocuments({ liveStatus: 'LIVE' });
    const withProdImage = await Barcode.countDocuments({ imageUrl: { $exists: true, $ne: "" } });
    const withBarcodeImage = await Barcode.countDocuments({ barcodeImageUrl: { $exists: true, $ne: "" } });
    const liveWithProdImage = await Barcode.countDocuments({ liveStatus: 'LIVE', imageUrl: { $exists: true, $ne: "" } });
    const liveWithBarcodeImage = await Barcode.countDocuments({ liveStatus: 'LIVE', barcodeImageUrl: { $exists: true, $ne: "" } });
    const liveWithEither = await Barcode.countDocuments({ 
        liveStatus: 'LIVE', 
        $or: [
            { imageUrl: { $exists: true, $ne: "" } },
            { barcodeImageUrl: { $exists: true, $ne: "" } }
        ]
    });
    
    console.log({ 
        total, 
        live, 
        withProdImage, 
        withBarcodeImage, 
        liveWithProdImage, 
        liveWithBarcodeImage,
        liveWithEither
    });
    
    const sampleLive = await Barcode.findOne({ liveStatus: 'LIVE' });
    console.log('Sample LIVE barcode:', sampleLive ? {
        barcode: sampleLive.barcode,
        liveStatus: sampleLive.liveStatus,
        imageUrl: sampleLive.imageUrl,
        barcodeImageUrl: sampleLive.barcodeImageUrl
    } : 'None');

    const sampleAny = await Barcode.findOne();
    console.log('Sample barcode:', sampleAny ? {
        barcode: sampleAny.barcode,
        liveStatus: sampleAny.liveStatus,
        imageUrl: sampleAny.imageUrl
    } : 'None');

    process.exit(0);
}

checkDB().catch(console.error);
