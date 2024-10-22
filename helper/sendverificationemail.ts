import { resend } from "@/lib/resend";

import VerificationEmail from "../emails/verificationemail";

export async function sendverificationemail(
    email:string,
    username:string,
    otp:string
){
    try {
            await resend.emails.send({
            from: 'Home Articles <onboarding@resend.dev>',
            to:email,
            subject: otp,
            react: VerificationEmail({username,otp}),
          });
          return {success:true,message:"Verification email send successfully"}
    } catch (error) {
        console.log("Email sending fails",error)
        return {success:false,message:"Failed to send opt email"}
    }
}
