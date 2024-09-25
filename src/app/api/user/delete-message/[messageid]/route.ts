import dbconnect from "@/lib/dbconnect";
import userModel from "@/model/user.model";
import {User} from "next-auth"
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/option";



export async function DELETE(request : Request ,{params} : {params : {messageid : string}}){

    await dbconnect();

    const messageId = params.messageid;

    console.log("messageid : " , messageId);


    //get user in session
    const session = await getServerSession(authOptions);
      //user access in session
      const user :User = session?.user  as User;

    //  console.log("user  : " , user);


      if(!session || !session.user){
        return Response.json({
            success : false,
            massage  : "User is not Authenticated" ,
          
        } , {
            status : 404
        })
      }

      try {

        //delete message in database

       const result =  await userModel.updateOne(
          {_id : user._id} ,
          {$pull :{ messages : {_id : messageId}}}
        );
        console.log("result of user message delete   : " , result);

        if(result.modifiedCount == 0){
          return Response.json({
            success : false,
            message : "messages is allready deleted.."
          } ,  { status : 404})
        }
        

        return Response.json({
          success : true,
          message : "messages is delete successfully......."
        } ,  { status : 202})
      } catch (error) {
 console.log("error....................  : " , error);
        return Response.json({
          success : false,
          message : "messages is delete server errros........",
          error
        } ,  { status : 500})
        
      }

 }





