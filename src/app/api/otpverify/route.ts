import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnects';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { date } from 'zod';

export async function POST(req: Request) {
    console.log(req)
    try {
        // Parse the request body
        const {id,otp} = await req.json();
        console.log("in route ",id)
        console.log("in route ",otp)
        // Connect to the database
        
        await dbConnect();
        
        

        // Find the user by email
        const user = await UserModel.findOne({ _id:id });
        console.log(id)
        console.log(otp)
        console.log(user)


        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });
        }

        // Ensure that user.otpExpires is defined and the OTP has not expired
        console.log(!user.otpExpires)
        console.log(new Date() , user.otpExpires)
        // if (!user.otpExpires || new Date() > user.otpExpires) {
        if(!user.otpExpires){
            return NextResponse.json({ success: false, message: 'OTP has expired' }, { status: 400 });
        }

        // Ensure that user.otp is defined before comparing
        if (!user.otp) {
            return NextResponse.json({ success: false, message: 'No OTP found for this user' }, { status: 400 });
        }

        // Verify the OTP
        console.log(otp)
        console.log(user.otp)
        const isMatch = await bcrypt.compare(otp, user.otp);
        if (otp!=user.otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        // OTP is valid, now complete the registration
        user.isVerified = true;  // Mark the user as verified
       

        // Save the fully registered user
        await user.save();
        console.log('hey this is optverifying file your otp varified successfully and her is verified is true')
        // Return a success response
        return NextResponse.json({ success: true, message: 'OTP verified and user registered successfully!' });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
