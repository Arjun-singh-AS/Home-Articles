import { NextRequest, NextResponse } from "next/server";
// import shortid from "shortid";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnects";
import OrderModel from "@/model/order";




export async function POST(req: NextRequest) {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    quantity,
    productId,
    paymenttype,
    size,
    color,
    image,
    userid,
    address,
    username,
    email,
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

    const newOrder = new OrderModel({

      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      productId: productId,
      userId: userid,
      quantity: quantity,
      address: address,
      size: size,
      color: color,
      status: 'Pending',          // Status of the order (Pending, Shipped, Delivered, Cancelled)
      createdAt: new Date(),        // Date of order creation
      amount: amount,
      paymentMethod: paymenttype,   // Payment method: 'COD' or 'Online'
      image:image,
      username:username,
      email:email,
      totalamount:amount
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
      // return NextResponse.redirect(new URL(`/success/${razorpay_payment_id}`, req.url));
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