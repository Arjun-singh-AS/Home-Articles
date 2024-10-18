import mongoose, { Schema, Document } from 'mongoose';

// Interface for Order
export interface Order extends Document {
  orderId: string;         // Unique identifier for the order
  paymentId: string;       // Razorpay payment ID
  signature: string;       // Razorpay signature
  productId: number;       // Reference to the Product (as number, not ObjectId)
  userId: mongoose.Schema.Types.ObjectId;    // Reference to the User model
  quantity: number;        // Quantity of the product ordered
  address: string;         // Shipping address
  size: string;            // Size of the product
  color: string;           // Color of the product
  status: string;          // Status of the order (Pending, Shipped, Delivered, Cancelled)
  createdAt: Date;         // Date of order creation
  amount: number;          // Total amount for the order
  paymentMethod: string;   // Payment method: 'COD' or 'Online'
  username: string;   
  email: string;   
  image:string;
}

// Define Order Schema
const orderSchema: Schema<Order> = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true, // Ensures each order ID is unique
  },
  paymentId: {
    type: String,
    required: true, // Payment ID is required for successful payments
  },
  signature: {
    type: String,
    required: true, // Signature is required for verification
  },
  productId: {
    type: Number,
    required: true, // Now using number instead of ObjectId
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensures that the quantity is at least 1
  },
  address: {
    type: String,
    required: true, // Address is required
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], // Allowed statuses
    default: 'Pending', // Default order status
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the created date
  },
  amount: {
    type: Number,
    required: true, // Ensure the amount is required
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'], // Allowed payment methods
    required: true, // Ensure payment method is required
  },
  username: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
  },
  image:{
    type:String,
    required:true,
  },
});

// Export the Order model
export const OrderModel = mongoose.models.Order as mongoose.Model<Order> || mongoose.model<Order>('Order', orderSchema);
export default OrderModel;
