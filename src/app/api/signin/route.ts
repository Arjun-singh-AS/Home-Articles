import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnects';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export async function POST(request:Request) {
  await dbConnect();
  
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'yourSecretKey', { expiresIn: '1h' });

    return NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        token,  // Include token in the JSON response
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600,
            sameSite: 'strict',
            path: '/',
          }),
        },
      }
    );
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during sign-in' },
      { status: 500 }
    );
  }
}
