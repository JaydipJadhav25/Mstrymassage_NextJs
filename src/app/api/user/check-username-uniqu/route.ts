import dbconnect from "@/lib/dbconnect";
import userModel from "@/model/user.model";
import { usernamevalidation} from "@/schema/signupschema"
import {z} from "zod"


//create schema withvalidaion
const usernameQuerySchema = z.object({
    username : usernamevalidation
})



export async function GET(request : Request){

await dbconnect();

try {

    //get username in url
    const { searchParams} = new URL(request.url);
    console.log(searchParams)

    //username access
 const queryparams = {
    username : searchParams.get('username')
 }

 console.log( queryparams);

// validation 
const result = usernameQuerySchema.safeParse(queryparams);

        console.log("username validations : " ,result);

        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];
            console.log("username error : " , usernameError);

            return Response.json({
                success : false,
                message  :  usernameError,
               
            } , {
                status : 404
            })
        }

        const  {username} = result.data;

        //databasecall

       const existingVerifiedUser =  await userModel.findOne({
            username , isverifyfied : true
        })

        // console.log("existingVerifiedUser : " , existingVerifiedUser);

        if(existingVerifiedUser){

            return Response.json({
                success : false,
                message  : "username is already taken",
              
            } , {
                status : 404
            })
        }

        //final done

        return Response.json({
            success : true,
            message  : "Username is unique",
      
        } , {
            status : 202
        })

    
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
