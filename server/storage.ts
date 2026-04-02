import { IBarcode, Barcode, IApplication, Application, User, IUser, IOrder, Order } from "./models";

export interface IStorage {
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser>;
  updateUserProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;

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

  // Order methods
  createOrder(order: Partial<IOrder>): Promise<IOrder>;
  getOrdersByUser(userId: string): Promise<IOrder[]>;
  getAllOrders(): Promise<IOrder[]>;
  updateOrder(id: string, updateData: Partial<IOrder>): Promise<IOrder | null>;
}

export class MongoStorage implements IStorage {
  async getAllUsers(): Promise<IUser[]> {
    return User.find().sort({ createdAt: -1 });
  }

  async getUser(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const newUser = new User(user);
    return newUser.save();
  }

  async updateUserProfile(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true });
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
    // Excluding large base64 image fields to prevent memory crashes and network timeouts
    return Barcode.find().select('-imageUrl -barcodeImageUrl').sort({ createdAt: -1 }).lean() as any;
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

  async createOrder(order: Partial<IOrder>): Promise<IOrder> {
    const newOrder = new Order(order);
    return newOrder.save();
  }

  async getOrdersByUser(userId: string): Promise<IOrder[]> {
    return Order.find({ userId }).sort({ createdAt: -1 });
  }

  async getAllOrders(): Promise<any[]> {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const users = await User.find().lean();
    const userMap = new Map(users.map(u => [String(u._id), u]));

    return orders.map(order => {
      const u = userMap.get(String(order.userId));
      return {
        ...order,
        user: u ? {
          username: u.username,
          email: u.email,
          avatarUrl: u.avatarUrl,
          isVerified: u.isVerified
        } : null
      };
    });
  }

  async updateOrder(id: string, updateData: Partial<IOrder>): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export const storage = new MongoStorage();
