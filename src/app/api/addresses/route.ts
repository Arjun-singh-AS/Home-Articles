import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnects'; // Ensure this function connects to your MongoDB
import UserModel from '@/model/User'; // Import your User model
import jwt from 'jsonwebtoken';



export async function GET(request: Request) {
  await dbConnect(); // Connect to the database

  try {
    // Retrieve the JWT token from request headers
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Extract user ID from the token
    const { id } = decoded as { id: string };

    // Find the user by their ID
    const user = await UserModel.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's addresses
    return NextResponse.json(
      { success: true, user},
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching addresses:', error);
    const message = (error instanceof Error) ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching the addresses', error: message },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  console.log("POST request received for adding addresses");

  await dbConnect(); // Connect to the database

  try {
    // Retrieve the JWT token from request headers
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"
    console.log('Token:', token); // Log token

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
    } catch (err) {
      console.error('Token verification error:', err);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Extract user ID from token
    const { id } = decoded as { id: string };
    console.log('Decoded ID:', id); // Log the decoded ID

    // Find the user by their ID
    const user = await UserModel.findById(id);
    if (!user) {
      console.error('User not found:', id);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get the address from the request body
    const { address } = await request.json();
    console.log('Incoming address:', address); // Log the address

    // Check if address is provided
    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Address is required' },
        { status: 400 }
      );
    }
    
    // Update the user's addresses
    console.log(address)
    user.addresses.push(address); // Add the new address to the user's addresses
    await user.save(); // Save the updated user
    console.log('Updated addresses:', user.addresses); // Log updated addresses

    return NextResponse.json(
      { success: true, addresses: user.addresses },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error adding address:', error); // Log specific error
    
    // Use type assertion to narrow the type of error
    const message = (error instanceof Error) ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      { success: false, message: 'An error occurred while adding the address', error: message },
      { status: 500 }
    );
  }
}
