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

      try {
        
        
      } catch (error) {
        
      }

      



}