import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmail";
import { apiresponse } from "@/types/apiresponse";




export async function sendVerificationEmail(
    email : string,
    username : string,
    verifycode : string
) : Promise<apiresponse>{


    try {



        await resend.emails.send({
            from: 'jaydipjadhav.dev.com',
            to: email,
            subject: 'mstrybox / verification email',
            react: VerificationEmail({ username , otp : verifycode}),
          });


        return { success : false , message : "send email successfully......"}

        
    } catch (error) {
        console.log("send email failed... , " , error);

        return { success : false , message : "send email failed..."}
    }
}