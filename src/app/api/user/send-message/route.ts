import dbconnect from "@/lib/dbconnect";
import userModel from "@/model/user.model";
import { z} from "zod"
import { Messageinterface } from "@/model/user.model";


export const messageSchema = z.object({
    content : z 
    .string()
    .min(10 , { message : " message content must be atleast of 10 char"})
    .max(300 , { message : " message content not longer than 300 char"})
 
 })



export async function POST(request :Request){
    await dbconnect();

    //filed

    const{username , content} = await request.json();
   console.log(username , content);

  const correctContent =  await messageSchema.safeParse({content});

    console.log("correctContent  : " , correctContent);

    if(!correctContent.success){
        const messageError =  correctContent.error.format().content?._errors
        console.log(messageError);
        return Response.json({
            success : "false",
            message : "invalide message formate",
            messageError
           

        })
    }
   
   try {
     
    //check username is exsiting
    const user = await userModel.findOne({username : username});
 
    console.log(user);
 
         if(!user){
             return Response.json({
                 success : false,
                 massage  : "user is not found.........",
             
             
             } , {
                 status : 500
             })
         }
 

         //check messagesaccspting status
         if(!user.isAcceptingMassage){
            return Response.json({
                success : false,
                massage  : "user is not accapting messages...",
               
              
            } , {
                status : 400
            })
         }
 

         //create new message

         const newMessages = {content , createdAt : new Date() };
         console.log("new message: " , newMessages);

         //defined message datatype
         user.messages.push(newMessages as Messageinterface);

         await user.save();

         return Response.json({
            success : true,
            massage  : "Send Messages successfully....",
           
          
        } , {
            status : 200
        })


   } catch (error: any) {

    return Response.json({
        success : false,
        massage  : "Send Messages error......",
        err : error.message
       
      
    } , {
        status : 500
    })
    
   }

}




