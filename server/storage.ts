import { IBarcode, Barcode, IApplication, Application, User, IUser } from "./models";

export interface IStorage {
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser>;

  // Barcode methods
  createBarcode(barcode: Partial<IBarcode>): Promise<IBarcode>;
  getBarcodeByCode(code: string): Promise<IBarcode | null>;
  getBarcodeById(id: string): Promise<IBarcode | null>;
  getAllBarcodes(): Promise<IBarcode[]>;
  updateBarcode(id: string, barcode: Partial<IBarcode>): Promise<IBarcode | null>;
  deleteBarcode(id: string): Promise<boolean>;

  // Application methods
  createApplication(app: Partial<IApplication>): Promise<IApplication>;
  getAllApplications(): Promise<IApplication[]>;
  updateApplicationStatus(id: string, status: 'Pending' | 'Approved' | 'Rejected'): Promise<IApplication | null>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username });
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const newUser = new User(user);
    return newUser.save();
  }

  async createBarcode(barcode: Partial<IBarcode>): Promise<IBarcode> {
    const newBarcode = new Barcode(barcode);
    return newBarcode.save();
  }

  async getBarcodeByCode(code: string): Promise<IBarcode | null> {
    return Barcode.findOne({ barcode: code });
  }

  async getBarcodeById(id: string): Promise<IBarcode | null> {
    return Barcode.findById(id);
  }

  async getAllBarcodes(): Promise<IBarcode[]> {
    return Barcode.find().sort({ createdAt: -1 });
  }

  async updateBarcode(id: string, barcode: Partial<IBarcode>): Promise<IBarcode | null> {
    return Barcode.findByIdAndUpdate(id, barcode, { new: true });
  }

  async deleteBarcode(id: string): Promise<boolean> {
    const result = await Barcode.findByIdAndDelete(id);
    return !!result;
  }

  async createApplication(app: Partial<IApplication>): Promise<IApplication> {
    const newApp = new Application(app);
    return newApp.save();
  }

  async getAllApplications(): Promise<IApplication[]> {
    return Application.find().sort({ createdAt: -1 });
  }

  async updateApplicationStatus(id: string, status: 'Pending' | 'Approved' | 'Rejected'): Promise<IApplication | null> {
    return Application.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export const storage = new MongoStorage();
