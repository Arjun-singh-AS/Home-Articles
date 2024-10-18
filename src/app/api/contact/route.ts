import dbConnect from "@/lib/dbConnects";
import ContactModel from "@/model/Contact"; // Ensure this model is correctly implemented
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect(); // Ensure database connection

    try {
        // Parse the incoming request data
        const { formData } = await request.json();

        // Validate the required fields in formData
        if (!formData || !formData.name || !formData.phone || !formData.message || !formData.email) {
            return NextResponse.json({
                success: false,
                message: "Please provide all required contact fields with valid types"
            }, { status: 400 });
        }

        // Create a new contact instance using the form data
        const newContact = new ContactModel({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            submittedAt: new Date()
        });

        // Save the contact form submission to the database
        await newContact.save();

        return NextResponse.json({
            success: true,
            message: "Contact form submitted successfully",
        }, { status: 201 });

    } catch (error) {
        // Handle any errors during the process
        console.error("Error in contact form submission:", error);

        return NextResponse.json({
            success: false,
            message: "An error occurred while submitting the contact form"
        }, { status: 500 });
    }
}
