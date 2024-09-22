"use client"

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schema/verifyschema';
import { zodResolver } from '@hookform/resolvers/zod';

import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm   } from 'react-hook-form';
import * as z from "zod"


// const verifySchema = z.object({

//     code : z.string().length(6, 'verification code must be 6 digits')
    
// })


export default function Page() {


  const[ isverifying , setIsVerifying] = useState(false);





    const route = useRouter();
    // console.log("router : ", route);
    //data take in params

    const param = useParams<{username : string}>();

    const { toast } = useToast();

 //form 
 const form = useForm<z.infer<typeof verifySchema>>({

    resolver : zodResolver(verifySchema),

  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {

    console.log("data  : " , data);
    setIsVerifying(true);

    try {


    const respone = await axios.post("/api/user/verify-code" , {
        username : param.username,
        code  : data.code
    });
    

    console.log("respone : " , respone);

   

    toast({
        title : "success",
        description : respone.data.message
    });

    // done so redirect
    route.replace("/sign-in");

        
    } catch (error) {
       
        console.log(error);
        const exiosError = error as AxiosError<AxiosError>;
        console.log( "exiosError  :" , exiosError );
    
      


     const errorMessage = exiosError.response?.data.message;
     

     if(errorMessage === "user is allready verified..."){
      setIsVerifying(false);
      route.replace("/sign-in");
     }
    
     toast({
      title : "verification failed..",
      description : errorMessage,
      variant : "destructive"
     })
 


    }

  }

  return (
       
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
      
      <Form  {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field}/>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">

              {isverifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Account
                </>
              ) : (
                'verify'
              )}
             </Button>
          </form>

      </Form>


    </div>
  </div>


  )
}
