import dbConnect from "@/lib/dbConnects";
import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/model/User';

export async function GET(req: NextRequest) {
    await dbConnect();
    console.log('this')
    try {
        // Extracting the 'id' from the query parameters
        const userId = req.nextUrl.searchParams.get('id');
        console.log("userId",userId)

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User ID not provided"
            }, { status: 400 });
        }

        // Fetch user based on the ID from the query params
        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        console.log('this is finduser file that should be called after after otpverify')
        return NextResponse.json({
            success: true,
            user
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while fetching user"
        }, { status: 500 });
    }
}
