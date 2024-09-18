import { NextAuthOptions } from "next-auth"
import dbconnect from "@/lib/dbconnect"
import userModel from "@/model/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import  bcrypt from "bcrypt"

export const authOptions :NextAuthOptions = {
    
providers :[
    CredentialsProvider ({
         id : "credentials",
         name : "Credentials",
         credentials: {
            email:  { label : "email" , type : "text"},
            password: { label :  "password" , type :  "password"}

         } ,
         async authorize(credentials: any) :Promise<any>{
            await dbconnect();
            try {
                //user email find
             const user =    await userModel.findOne({
                    $or : [
                           { email : credentials.identifier } ,
                           { username : credentials.identifier}
                        ]
                });

            if(!user){
                throw new Error("user not fount this email");
            }    

            // check user is verified or not
            if(user.isverifyfied){
                throw new Error(" user is not verifired befor login verified your account first");
            } 

            //check password
            const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password );

            if(isPasswordCorrect){

                return user;

            }else{
                throw new Error("password incorrect , try agin")
            }





            } catch (error: any) {
                throw new Error(error);
            }
         }
    })
],

callbacks : {
    async jwt({ token , user}){
       //add fileds
    if(user){
        token._id = user._id?.toString()
        token.isverifyfied= user.isverifyfied
        token.isAcceptingMassage = user.isAcceptingMassage
        token.username = user.username
    }


        return token
    },
    async session({ token , session}){

        if(token){
           session.user._id = token._id
           session.user.isverifyfied = token.isverifyfied
           session.user.isAcceptingMassage = token.isAcceptingMassage
           session.user.username  = token.username;

        }

        return session;
    }
},

pages : {
    signIn : "/sign-in"
},

session : {
    strategy : "jwt"
},

secret : "jaydipjadhav@132"
    
}