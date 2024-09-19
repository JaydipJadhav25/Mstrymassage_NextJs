import dbconnect from "@/lib/dbconnect";
import userModel from "@/model/user.model";
import {User} from "next-auth"
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import mongoose from "mongoose";



export async function POST(request : Request){

    await dbconnect();

    //get user in session
    const session = await getServerSession(authOptions);
      //user access in session
      const user :User = session?.user  as User;

     console.log("user  : " , user);


      if(!session || !session.user){
        return Response.json({
            success : false,
            massage  : "User is not Authenticated" ,
          
        } , {
            status : 404
        })
      }

      //id convert into mongodb obj id
      const userId = new mongoose.Types.ObjectId(user._id);

      console.log(userId);


      try {
        
      const user = await userModel.aggregate([
          
            { $match :  { _id : userId}} ,
            { $unwind : "$messages"},
            { $sort : {'messages.createdAt' : -1}},
            {$group : {_id : "$_id" , messages : {
              $push : "$messages"
            }}}
      
        ])




        if(!user || user.length === 0 ){

          return Response.json({
            success : false,
            massage  : "user is not found.........",
           
          
        } , {
            status : 500
        })

        }

        return Response.json({
          success : true,
          massage  : user[0].messages,
         
        
      } , {
          status : 200
      })
        
      } catch (error) {

        return Response.json({
          success : false,
          massage  : "user get message fetching error......",
          error ,
        
      } , {
          status : 500
      })
        
      }

      



}