import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnects";
import OrderCartModel from "@/model/ordercart";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
      const {
                  currency,
                  paymenttype,
                  userid,
                  address,
                  username,
                  email,
                  cartItems,
                  overallTotal
      } = await req.json();
  
      // Connect to the database
      await dbConnect();
  
      // Create unique order ID and payment ID (Here, you could use Razorpay's actual order/payment process)
      const razorpay_order_id = crypto.randomBytes(16).toString("hex");
      const razorpay_payment_id = crypto.randomBytes(16).toString("hex");
  
      // Signature for order verification (You can replace this with actual signature verification logic)
      const razorpay_signature = crypto.randomBytes(20).toString("hex");
  
      // Create a new order instance
      const newOrder = new OrderCartModel({
        orderId:razorpay_order_id,
        paymentId:razorpay_payment_id,
        signature:razorpay_signature,
        userId:userid,
        address:address,
        status:'Pending',
        createdAt: new Date(),
        totalamount:overallTotal,
        CartItem:cartItems, // Array of CartItem schemas
        paymentMethod: paymenttype,
        username:username,
        email:email
      });
  
      // Save the new order to the database
      await newOrder.save();
      console.log(newOrder)
      // Return a success response
      return NextResponse.json({
        message: "Order created successfully",
        order: newOrder
      }, { status: 200 });
  
    } catch (error) {
      // Cast the error to the 'Error' type to access the 'message' property
      const err = error as Error;
  
      console.error("Error creating order:", err.message);
      
      // Return an error response
      return NextResponse.json({
        message: "Failed to create order",
        error: err.message
      }, { status: 500 });
    }
  }
  