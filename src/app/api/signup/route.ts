import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnects';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { sendverificationemail } from '../../../../helper/sendverificationemail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password, phone } = await request.json();
    console.log('1')

    if (!username || !email || !password || !phone) {
      return NextResponse.json({
        success: false,
        message: "Please enter all the required fields",
      }, { status: 400 });
    }
    console.log('2')
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('3')

    // Case 1: User already exists and is verified
    if (existingUserByEmail && existingUserByEmail.isVerified) {
      console.log('4')
      return NextResponse.json({ 
        success: false,
        message: "User already exists with this email",
      }, { status: 400 });
    }

    // Case 2: User exists but is not verified
    else if (existingUserByEmail && !existingUserByEmail.isVerified) {
      // Generate a new OTP and update user details
      const updatedOtpExpiry = new Date();
      updatedOtpExpiry.setHours(updatedOtpExpiry.getHours() + 1); // Set OTP expiration time

      existingUserByEmail.otp = verifycode;
      existingUserByEmail.otpExpires = updatedOtpExpiry;
      existingUserByEmail.username=username;
      existingUserByEmail.password=password;
      existingUserByEmail.phone=phone;

      await existingUserByEmail.save(); // Save the updated user

      // Resend verification email
      const emailResponse = await sendverificationemail(
        email,
        username,
        verifycode
      );
      console.log("emailResponse",emailResponse);
      console.log("userotp",verifycode);
      if (!emailResponse) {
        return NextResponse.json({
          success: false,
          message: "Failed to send verification email",
          status: 500
        });
      }

      const token = jwt.sign(
        { id: existingUserByEmail._id, email: existingUserByEmail.email, phone: existingUserByEmail.phone, address: [] },
        process.env.JWT_SECRET || 'yourSecretKey',
        { expiresIn: '1h' }
      );

      // Create cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600, // 1 hour
        sameSite: 'strict' as const, // Specify sameSite correctly
        path: '/',
      };

      console.log('Response with Set-Cookie header:', {
        'Set-Cookie': cookie.serialize('token', token, cookieOptions),
      });

      // Return response with the session and token
      return NextResponse.json({
        success: true,
        message: "User registered successfully. Please verify your email",
        token,
      }, {
        status: 200,
        headers: {
          'Set-Cookie': cookie.serialize('token', token, cookieOptions),
        },
      });
    }

    // Case 3: User doesn't exist, create a new user
    else {
      console.log('5')
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAt = new Date();
      const expdate = new Date();
      expdate.setHours(expdate.getHours() + 1);
      console.log("expdate", expdate, createdAt);
      console.log(expdate > createdAt);

      const newUser = new UserModel({
        username,
        email,
        phone,
        password: hashedPassword,
        createdAt: createdAt,
        otp: verifycode,
        otpExpires: expdate,
        isVerified: false,  // User isn't verified yet
      });

      const emailResponse = await sendverificationemail(
        email,
        username,
        verifycode
      );
      console.log(emailResponse);

      if (!emailResponse) {
        return NextResponse.json({
          success: false,
          message: "Failed to send verification email",
          status: 500,
        });
      }

      await newUser.save();
      console.log(emailResponse);

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, phone: newUser.phone, address: [] },
        process.env.JWT_SECRET || 'yourSecretKey',
        { expiresIn: '1h' }
      );

      // Create cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600, // 1 hour
        sameSite: 'strict' as const, // Specify sameSite correctly
        path: '/',
      };

      console.log('Response with Set-Cookie header:', {
        'Set-Cookie': cookie.serialize('token', token, cookieOptions),
      });

      // Return response with the session and token
      return NextResponse.json({
        success: true,
        message: "User registered successfully. Please verify your email",
        token,
      }, {
        status: 200,
        headers: {
          'Set-Cookie': cookie.serialize('token', token, cookieOptions),
        },
      });
    }
  } catch (error) {
    console.log("Error registering user", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred during registration",
    });
  }
}
