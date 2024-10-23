// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json(); // Expecting base64 image string

    const uploadResponse = await cloudinary.uploader.upload(data, {
      upload_preset: 'HomeArticles', // Set the preset in Cloudinary dashboard
    });

    return NextResponse.json({ success: true, url: uploadResponse.secure_url });
  } catch (error) {
    console.log("upload error",error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
