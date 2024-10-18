import dbConnect from "@/lib/dbConnects";
import ProductModel from "@/model/Product"; // Ensure you import your Product model
import { NextResponse } from 'next/server';

// POST Method: Add a new product
export async function POST(request: Request) {
    await dbConnect();

    try {
        const { 
            id,
            name, 
            sellingPrice, 
            markPrice, 
            description, 
            hproduct, 
            ratings, 
            reviews, 
            colors, 
            categories, 
            image 
        } = await request.json();

        // Validate required fields
        if (!id ||
            !name || 
            typeof name !== 'string' || 
            typeof sellingPrice !== 'number' || 
            typeof markPrice !== 'number' || 
            !description || 
            typeof description !== 'string' || 
            typeof ratings !== 'number' || 
            !Array.isArray(categories) || 
            !image
        ) {
            return NextResponse.json({
                success: false,
                message: "Please provide all required product fields with valid types"
            }, { status: 400 });
        }

        // Create a new product instance
        const newProduct = new ProductModel({
            id,
            name,
            sellingPrice,
            markPrice,
            description,
            hproduct: hproduct || false, // Default to false if not provided
            ratings,
            reviews: reviews || [], // Default to an empty array if not provided
            colors,
            categories,
            image,
            createdAt: new Date(), // Optional: to track when the product was added
        });

        // Save the product to the database
        await newProduct.save();

        return NextResponse.json({
            success: true,
            message: "Product added successfully",
            product: newProduct // Return the newly created product
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while adding the product"
        }, { status: 500 });
    }
}


// GET Method: Fetch all products from the database
export async function GET() {
    await dbConnect();

    try {
        // Fetch all products from the database
        const products = await ProductModel.find({});

        return NextResponse.json({
            success: true,
            products
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while fetching products"
        }, { status: 500 });
    }
}
