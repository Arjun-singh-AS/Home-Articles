import { NextRequest, NextResponse } from "next/server";

// import shortid from "shortid";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnects";
import OrderCartModel from "@/model/ordercart";



export async function POST(req: NextRequest) {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymenttype,
    userid,
    address,
    username,
    email,
    cartItems,
    overallTotal,
  } =
    await req.json();
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  console.log("id==", body)

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET || '')
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;


  if (isAuthentic) {

    await dbConnect()

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

    // Save the product to the database
    await newOrder.save();

    //    await Payment.create({
    //      razorpay_order_id,
    //      razorpay_payment_id,
    //      razorpay_signature,
    //    });


    if (razorpay_payment_id) {
      console.log("Redirecting to success page with payment ID:", razorpay_payment_id);
      return NextResponse.json({ success: true, message: 'Paymentn made successfully' ,status:200,razorpay_payment_id});
    } else {
      return NextResponse.redirect(new URL('/error', req.url)); // Handle cases where payment ID is missing
    }


  }
  else {
    return NextResponse.json({
      message: "fail"
    }, {
      status: 400,
    })

  }

}