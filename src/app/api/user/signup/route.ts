// import{NextRequest , NextResponse} from "next/server"
import userModel from "@/model/user.model"
import dbconnect from "@/lib/dbconnect"
import { sendVerificationEmail } from "@/helpers/sendEmailVerification";
import bcrypt from "bcrypt"






export async function POST(request : Request) {

    //datebase connection
    await dbconnect();

    try {

        const {username , email , password } = await request.json();
        console.log("data : " , username , email , password);

         //check uniqu username

         const exitingUserByUsername = await userModel.findOne({
            username,
            isverifyfied : true
         });

         console.log("exitingUserByUsername : " , exitingUserByUsername);


         if(exitingUserByUsername){

            return Response.json({
                success : false,
                massage : "username is already exited....."
            } , { status : 401})
         }


         //check on email 
        //check userexting by email 
        //1.ahe but to verify nhi tr verify kru with new data
        //2.nhi tr new user create


         const exitingUserByEmail = await userModel.findOne({email});

         //otp
         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
         console.log(verifyCode);


         if(exitingUserByEmail){



              //user email and it is  verified 
                    if(exitingUserByEmail.isverifyfied){
                      
                      
                      return Response.json({
                        success :  false,
                        message  :"user alread exist with this email ....."
                      },{
                        status : 404
                      }
                    )
                      

                    }else{
                      //email is exting but it is not verifed email so update info
                      const hashPassword = await bcrypt.hash(password , 10);

                      //update fileds
                      exitingUserByEmail.password = hashPassword;
                      exitingUserByEmail.verifycode = verifyCode;
                      exitingUserByEmail.verifycodeExpiry = new Date(Date.now() + 3600000);

                      //save
                      await exitingUserByEmail.save();


                    }



            console.log(exitingUserByEmail);

         }else{
            //user is not
                        const hashPassword = await bcrypt.hash(password , 10);
                        console.log("hashPassowrd : " , hashPassword);

                        //expiryDate
                        const expiryDate = new Date()
                        expiryDate.setHours(expiryDate.getHours() + 1 );
                        console.log(expiryDate);

                        //create user object

                  const newUser = new userModel({
                        username ,
                        email ,
                        password : hashPassword,
                        verifycode : verifyCode,
                        isverifyfied : false,
                        verifycodeExpiry : expiryDate,
                        isAcceptingMassage : true,
                        messages : []
                      })
                      console.log("user object : " , newUser);
                      //save document / object

                  await newUser.save();


        }//


        // send Email for verification email

        const EmailResponce = await sendVerificationEmail(
          username ,
          email ,
          verifyCode
        )

        console.log("email responce : " , EmailResponce , EmailResponce.message);

        if(!EmailResponce.success){

          return Response.json(
            {
            success : false ,
            massage :EmailResponce.message,
            },
            {
              status : 402 
                
            }
    )

        }



        return Response.json(
            {
            success : true ,

            massage : " user registring successfully...",
        
            },
            {
              status : 202 
                
            }
    )
       
        
    } catch (error) {
        console.error("user registring erro..." , error);
        
        return Response.json(
            {
            success : false ,
            massage : " user registring erro...",
            },
            {
              status : 500  
                
            }
    )
        
    }
    
}
