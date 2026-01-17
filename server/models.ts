import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password?: string;
    isAdmin: boolean;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
});

export const User = mongoose.model<IUser>('User', UserSchema);

export interface IBarcode extends Document {
    // Overview
    barcode: string;
    productName: string;
    brandName: string;
    country?: string;
    language?: string;
    category: string;
    description?: string;
    websiteLink?: string;
    amazonLink?: string;
    sku?: string;
    modelNumber?: string;
    price: number;
    currency: string;

    // Clothes
    color?: string;
    material?: string;
    size?: string;

    // Size / Weight / Volume
    width?: string;
    height?: string;
    length?: string;
    weight?: string;
    fluid?: string;
    pieces?: string;

    // Nutrition Information
    servingSize?: string;
    servingsPer?: string;
    calories?: string;
    fatCalories?: string;
    totalFat?: string;
    saturatedFat?: string;
    transFat?: string;
    cholesterol?: string;
    sodium?: string;
    potassium?: string;
    totalCarbohydrate?: string;
    dietaryFiber?: string;
    sugar?: string;
    protein?: string;
    ingredients?: string;

    // Publication
    author?: string;
    pageCount?: string;
    binding?: string;
    releaseYear?: string;
    published?: string;
    format?: string;
    runTime?: string;

    // Images & Meta
    imageUrl?: string;        // Product Front Image
    barcodeImageUrl?: string; // Barcode Image
    issueDate?: Date;
    status: 'Active' | 'Inactive';
    manufacturer?: string;
    createdAt: Date;
}

const BarcodeSchema: Schema = new Schema({
    // Overview
    barcode: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    country: { type: String },
    language: { type: String },
    category: { type: String },
    description: { type: String },
    websiteLink: { type: String },
    amazonLink: { type: String },
    sku: { type: String },
    modelNumber: { type: String },
    price: { type: Number },
    currency: { type: String, default: 'INR' },

    // Clothes
    color: { type: String },
    material: { type: String },
    size: { type: String },

    // Size / Weight / Volume
    width: { type: String },
    height: { type: String },
    length: { type: String },
    weight: { type: String },
    fluid: { type: String },
    pieces: { type: String },

    // Nutrition
    servingSize: { type: String },
    servingsPer: { type: String },
    calories: { type: String },
    fatCalories: { type: String },
    totalFat: { type: String },
    saturatedFat: { type: String },
    transFat: { type: String },
    cholesterol: { type: String },
    sodium: { type: String },
    potassium: { type: String },
    totalCarbohydrate: { type: String },
    dietaryFiber: { type: String },
    sugar: { type: String },
    protein: { type: String },
    ingredients: { type: String },

    // Publication
    author: { type: String },
    pageCount: { type: String },
    binding: { type: String },
    releaseYear: { type: String },
    published: { type: String },
    format: { type: String },
    runTime: { type: String },

    // Images & Meta
    imageUrl: { type: String },
    barcodeImageUrl: { type: String },
    issueDate: { type: Date },
    manufacturer: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    createdAt: { type: Date, default: Date.now },
});

export const Barcode = mongoose.model<IBarcode>('Barcode', BarcodeSchema);

export interface IApplication extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    productDetails: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: Date;
}

const ApplicationSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: true },
    productDetails: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
