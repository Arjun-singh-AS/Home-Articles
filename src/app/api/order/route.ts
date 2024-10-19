import dbConnect from "@/lib/dbConnects";
import{ OrderModel } from '@/model/order' // Ensure you import your Product model
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await dbConnect();  

    try {
        // Extracting the 'id' from the query parameters
        const order = req.nextUrl.searchParams.get('userId');
        console.log(order)
        if (!order) {
            return NextResponse.json({
                success: false,
                message: "User ID not provided"
            }, { status: 400 });
        }

        // Fetch user based on the ID from the query params
        const orders = await OrderModel.find({email:order});

        if (!orders) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            orders
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while fetching user"
        }, { status: 500 });
    }
}
