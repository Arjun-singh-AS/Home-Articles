import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface extending from Document
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  createdAt: Date;
  addresses: string[];
  isVerified: boolean; // Optional verification status
  otp: string;         // Optional OTP
  otpExpires: Date;    // Optional OTP expiration date
}

// Define the UserSchema
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the date when the user is created
  },
  addresses: [String],
  isVerified: {
    type: Boolean,
    default: false, // By default, the user is not verified
  },
  otp: {
    type: String,
    required: true, // OTP is optional
  },
  otpExpires: {
    type: Date,
    required: true, // OTP expiration is optional
  },
});

// Export the User model
const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', UserSchema);
export default UserModel;
