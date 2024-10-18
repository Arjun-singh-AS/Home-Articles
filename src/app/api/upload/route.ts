// import { NextApiRequest, NextApiResponse } from 'next'
// import { NextResponse } from 'next/server';
// import { join } from 'path';
// import { writeFile } from 'fs/promises';

// export default async function POST(req: NextApiRequest, res: NextApiResponse) {

//     console.log("thisnfs")
//     const data=await req.body.data
//     const file:File | null=data.get('file') as unknown as File

//     if(!file){
//       return NextResponse.json({success:false},{status:405})
//     }
    
//     const bytes=await file.arrayBuffer()
//     const buffer=Buffer.from(bytes)

//     const path=join('/','data',file.name)
//     await writeFile(path,buffer)

    

//     return NextResponse.json({success:true})
//     // try {
//     //   const uploadResponse = await cloudinary.uploader.upload(data, {
//     //     upload_preset: 'your-upload-preset', // Optional
//     //   });

//     //   res.status(200).json({ url: uploadResponse.secure_url });
//     // } catch (error) {
//     //   res.status(500).json({ error: 'Something went wrong while uploading.' });
//     // }
// }