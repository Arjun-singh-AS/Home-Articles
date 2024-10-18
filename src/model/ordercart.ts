import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the CartItem schema
const cartItemSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Define the Order schema
const ordercartSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], // Allowed statuses
    default: 'Pending', // Default order status
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalamount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  CartItem: [cartItemSchema], // Array of CartItem schemas
});

// Create and export the OrderCart model
export const OrderCartModel = mongoose.models.Order || mongoose.model('Order', ordercartSchema);
export default OrderCartModel;
