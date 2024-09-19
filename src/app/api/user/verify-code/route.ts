import dbconnect from "@/lib/dbconnect";
import userModel from "@/model/user.model";
// import { verifySchema } from "@/schema/verifyschema"
import { z} from "zod"

 const verifySchema = z.object({
    code : z.string().length(6, 'verification code must be 6 digits')
})







export async function POST(request : Request){

await dbconnect();

try {

     const { username , code } = await request.json();
    console.log(username , code);

 const decodedUsername = decodeURIComponent(username);
 console.log(decodedUsername);


 //check code validation
 const result =  verifySchema.safeParse({code});

//  const Error = result.error.format().code?._errors || [];
const codeError = result.error?.format().code?._errors

 console.log("result is ...............: " , result , "and error : " , codeError);



//  console.log("code : " , correctVerificasionCode);

          if(!result.success){
            
         
            return Response.json({
                success : false,
                massage  : "invalide code error" ,
                codeError
             
            } , {
                status : 404
            })
          }


        //   const { verifyCode } = correctVerificasionCode.data;
        //   console.log("verifyCode : " , verifyCode);
  


 //datebase call
    const existingUserByUsername = await userModel.findOne({username : decodedUsername});
      
    if(!existingUserByUsername){

        return Response.json({
            success : false,
            massage  : "user is not found , check your username",
         
        } , {
            status : 404
        })
    }

    //check token

    const isCodeValid = existingUserByUsername.verifycode === code;

    const isCodeExpriy = new Date(existingUserByUsername.verifycodeExpiry ) > new Date();
    console.log(isCodeValid , isCodeExpriy);

    if(isCodeValid && isCodeExpriy){
        //update fileds
        existingUserByUsername.isverifyfied = true;
        await existingUserByUsername.save();

        //return res
        return Response.json({
            success : true,
            massage  : "account verified successfully.......",
         
        } , {
            status : 202
        })
    }else if(!isCodeExpriy){

        return Response.json({
            success : false,
            massage  : "account verified code has expired. try again.....",
         
        } , {
            status : 402
        })

    }else{
        return Response.json({
            success : false,
            massage  : "account verified code is wrong.. try again",
         
        } , {
            status : 402
        })

    }



 


    
} catch (error) {
    console.log(error);
    return Response.json({
        success : false,
        massage  : error,
     
    } , {
        status : 404
    })
}

}
