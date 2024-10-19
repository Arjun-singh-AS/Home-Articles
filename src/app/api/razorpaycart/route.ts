import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/dbConnects';



// Named export for the POST method
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    console.log("this is 0")
    const body = await req.json();
    const {
               
                  overallTotal,
                  currency,
    } = body;
    console.log("this is 1")
    // Check if the amount and currency are provided
    if (!overallTotal || !currency) {
      return NextResponse.json({ error: 'Amount and currency are required' }, { status: 400 });
    }
    console.log("this is 2")
    // Initialize Razorpay instance
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY || '',
      key_secret: process.env.RAZORPAY_SECRET || '',
    });
    console.log("this is 3")
    // Prepare the order options
    const options = {
      amount: overallTotal * 100, // Amount should be in the smallest currency unit (e.g., paise for INR)
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    console.log("this is 4")
    // Create the Razorpay order
    const order = await razorpayInstance.orders.create(options);
    console.log("this is 5")
    // Return the order details in the response
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Something went wrong with Razorpay order creation' }, { status: 500 });
  }
}
