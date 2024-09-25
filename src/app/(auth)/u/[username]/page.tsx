'use client'


import { useToast } from '@/hooks/use-toast';
import { messageSchema } from '@/schema/messageschema';
import { apiresponse } from '@/types/apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {z} from "zod"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


export default function Page() {
  const userName = useParams<{username : string}>();
  console.log("username : " , userName);

  // const[message , setmessage] = useState('');
  const[loading , setloading] = useState(false);

  const {toast} = useToast();

//   useEffect(()=>{

//     async function checkUserIsAcceptingMessagesOrNot(){
//       try {
        
//        const respone =  await axios.get("/api/user/accept-messages");

       
//        if(respone){
//         //  const responeMessage = respone.data?.message;
//          console.log(respone)

//               if(respone.data.isAcceptingMessage){

//                 toast({
//                   title : "user Is Accepting Messages..............",
                  
//                 })

//               }else{
//                 toast({
//                   title : "user Is NOT Accepting Messages..............",
//                   variant : "destructive"
                  
//                 })
//               }
//        }

        


//       } catch (error) {

//         const exiosError = error as AxiosError<apiresponse>;

//  const errorMessage = exiosError.response?.data.message
// console.log("checkUserIsAcceptingMessagesOrNot error : " ,errorMessage);

//  toast({
//   title : " checkUserIsAcceptingMessagesOrNot error",
//   description : errorMessage,
//   variant : "destructive"
//  })
//       }
//     }

//     checkUserIsAcceptingMessagesOrNot();

//   },[username]);

  const form = useForm<z.infer<typeof messageSchema >>({
    resolver : zodResolver(messageSchema)
  })


  // to send message 

const onSubmit = async(data : z.infer<typeof messageSchema>) =>{
  console.log("data : " , data);

setloading(true);
  try {
    
    const respone = await axios.post("/api/user/send-message" , {
      username  : userName.username,
      content : data.content
    });



    console.log("respone : " , respone);

    // setmessage(respone.data.message);

    const usermessage = respone.data.message 
console.log(usermessage);
    toast({
      title :"Send Messages successfully....",
      variant : "destructive"
  
    })
   





  } catch (error) {

    const exiosError = error as AxiosError<apiresponse>;

 const errorMessage = exiosError.response?.data.message
console.log(" error : " ,errorMessage);
console.log("error  :" , exiosError);
// setmessage(errorMessage);

 toast({
  title : "  error",
  description : errorMessage,
  variant : "destructive"
 })

    
  } finally{
    setloading(false);
    
  }

}



  return (
   <>
     <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        
          <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


            <FormField

             name="content"
 
    control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>message</FormLabel>
      <FormControl>
        <Input placeholder="message" type='text'
        {...field} 
        />
        </FormControl>
 
        <FormMessage />
      </FormItem>
       )}
      />
   

   <Button type="submit">
{
  loading ?  (
    <>

<Loader2 className="mr-2 h-4 w-4 animate-spin" />
sending

    </>
  ) : (
    "send"
  )
}
  </Button>
            </form>


          </Form>

 </div>
 </div>
   </>
  )
}
