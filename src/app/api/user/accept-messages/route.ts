import dbconnect from "@/lib/dbconnect";
import userModel from "@/model/user.model";
import {User} from "next-auth"
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";



//update field messageaccept 
export async function POST(request : Request){
    await dbconnect();

    //get user in session
    const session = await getServerSession(authOptions);
      //user access in session
      const user :User = session?.user  as User;

      if(!session || !session.user){
        return Response.json({
            success : false,
            message  : "User is not Authenticated" ,
          
        } , {
            status : 404
        })
      }

      const userId = user._id;

      // take flage true or false 
      const { accaptMessage } = await request.json();

      console.log(accaptMessage);


      try {

       const updateUser =  await userModel.findByIdAndUpdate(
            userId ,
            {
                isAcceptingMassage : accaptMessage
            } ,
            {
                new : true
            }
        )

        if(!updateUser){
            return Response.json({
                success : false,
                message  : "User is not Accept messages" ,
              
            } , {
                status : 404
            })
        }

        return Response.json({
            success : true,
            message  : "Message accepting update successfully....." ,
          
        } , {
            status : 200
        })
        
      } catch (error) {
        return Response.json({
            success : false,
            message  : "accapt-message user error" ,
          
        } , {
            status : 404
        })
      }



}


/////////////////////////////////////////////////////////////////////////////////////////////////////////


//get field flag messageaccept

export async function GET(request : Request){
    await dbconnect();

    console.log( request);

    //get user in session
    const session = await getServerSession(authOptions);
      //user access in session
      const user :User = session?.user  as User;

      if(!session || !session.user){
        return Response.json({
            success : false,
            message  : "User is not Authenticated" ,
          
        } , {
            status : 404
        })
      }

      const userId = user._id; //fixes value are comming

      try {

        const foundUser = await userModel.findById(userId);

        if(!foundUser){
            return Response.json({
                success : false,
                message  : "User is Not Found...." ,

            } , {
                status : 404
            })
        }


        
        return Response.json({

            success : true,
            message  : "get user message accepting status.." ,
            isAcceptingMessage : foundUser.isAcceptingMassage
      
        } , {
            status : 200
        })
        
      } catch (error) {

        return Response.json({
            success : false,
            message  : "user message accepting message get flage error",
            error ,
          
        } , {
            status : 500
        })
        
      }


}





