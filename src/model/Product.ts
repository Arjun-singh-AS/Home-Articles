import mongoose, { Schema, Document } from 'mongoose';

// Interface for Size
export interface Size extends Document {
  size: string;
  instock: boolean;
  price: number;  // Added price specific to size
  mprice:number;
  images: string[]; // Retained the images field in Size
}

// Interface for Review
export interface Review extends Document {
  username: string;
  comment: string;
  rating: number;
}

// Interface for ColorVariant
export interface ColorVariant extends Document {
  color: string;
  sizes: Size[];
}

// Interface for Product
export interface Product extends Document {
  id: number;
  name: string;
  sellingPrice: number;  // The current selling price of the product
  markPrice: number;     // The original marked price of the product
  description: string;
  hproduct: boolean;     // Indicates if the product is a hot product
  ratings: number;       // Average rating as a number
  reviews: Review[];     // Array of reviews for the product
  colors: ColorVariant[]; // Array of color variants
  categories: string[];   // Array of categories for the product
  image: string;          // URL for the main product image
}

// Size Schema
const SizeSchema: Schema<Size> = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  instock: {
    type: Boolean,
    default: true,
  },
  price: {  // Added price specific to each size
    type: Number,
    required: true,
  },
  mprice:{
    type:Number,
    required:true,
  },
  images: {
    type: [String], // Retained images as an array of strings
    required: true,
  }
});

// Review Schema
const ReviewSchema: Schema<Review> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

// ColorVariant Schema
const ColorVariantSchema: Schema<ColorVariant> = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  sizes: [SizeSchema], // Array of Size schema
});

// Define Product Schema
const ProductSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  markPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hproduct: {
    type: Boolean,
    default: false, // Default value for hot product
  },
  ratings: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  reviews: [ReviewSchema], // Array of Review schemas
  colors: [ColorVariantSchema], // Array of ColorVariant schemas
  categories: {
    type: [String], // Array of categories
    required: true,
  },
  image: {
    type: String, // URL for the main product image
    required: true,
  },
});

// Export the Product model
export const ProductModel = mongoose.models.Product as mongoose.Model<Product> || mongoose.model<Product>('Product', ProductSchema);
export default ProductModel;
