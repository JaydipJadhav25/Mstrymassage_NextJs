"use client"
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {  useToast } from '@/hooks/use-toast';
import { Messageinterface } from '@/model/user.model'
import { acceptmessageSchema } from '@/schema/acceptmessageschema';
import { apiresponse } from '@/types/apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';

import { Loader2, RefreshCcw } from 'lucide-react';

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

export default function Page() {
  const[messages , setMessages] = useState<Messageinterface[]>([]);
  const[loading , setLoading] = useState(false);
  const[isSwitchingLoading , setisSwitchingLoading] = useState(false);

  const {toast} = useToast();


  // to optimize way update only ui
  const handleDeletMessage = async(messageId : any) =>{

    console.log("messageId.....: " , messageId);
    setMessages(messages.filter((message) =>{

      message._id !== messageId
    } ));
  }

  //get session

  const  {data : session} = useSession();


  //createform
  const form = useForm({
    resolver :zodResolver(acceptmessageSchema)
  })

  //extract values from form obj

  const {register , setValue , watch} = form;


  //watch on filed and get value
  const acceptmessage = watch("acceptMessage")
console.log("acceptmessage : " , acceptmessage);
  // console.log("acceptmessage : " , acceptmessage);

  // check UseraccpetMessage
  const fetchAccpetMessage = useCallback(async() =>{

    setisSwitchingLoading(true);

    try {

      //check is accepting message

      const respone = await axios.get<apiresponse>("/api/user/accept-messages");
     //update in filed // set in variable
    console.log("respone.data.isAcceptingMessage : " , respone.data.isAcceptingMessage);

     setValue("acceptMessage" , respone.data.isAcceptingMessage);
      
    } catch (error) {

      const axiosError  = error as AxiosError<apiresponse>;
  
      console.log("axiosError in fetchuserAccepting message  : " , axiosError);

      toast({
        title:"Error in fetchAccpetMessage",
        description : axiosError.response?.data.message
      })

      
    } finally{

      setisSwitchingLoading(false);

    }



  },[setValue])



  //get messages
  const fetchMessages= useCallback(async(refresh:boolean = false)=>{
    setLoading(true);
    setisSwitchingLoading(false);
    try {
      
      const respone = await axios.post("/api/user/get-messages");

      console.log("respone : " , respone);
      
      setMessages(respone.data.messages);

      if(refresh){
        toast({
          title : "refreting messages",
          description  : "showing leatest Messages.."
        });
      }


    } catch (error) {

      const axiosError  = error as AxiosError<apiresponse>;

      console.log(axiosError);

      toast({
        title:"User fetchMessages Error",
        description : axiosError.response?.data.message
      })

      
    }finally{

      setisSwitchingLoading(false);
      setLoading(false);

    }
  }, [setLoading , setMessages]);

//useHook to run this fun

useEffect(() =>{
  if(!session || !session.user) return

  //call functions
  fetchMessages();
  fetchAccpetMessage();

},[session , fetchAccpetMessage , fetchMessages]);

//handlr switching butthon
//update is accpeting messages or not
const handlSwitching = async()=>{

  try {

    //true ->false
const respone  =   await axios.post("/api/user/accept-messages" , {
      accaptMessage  : !acceptmessage 
    })
    console.log("handlSwitching  respone : " , respone);

    //state made value save krne
    setValue("acceptMessage" , !acceptmessage);
    toast({
      title : respone.data.message,
      
    })

    
  } catch (error) {
    const axiosError  = error as AxiosError<apiresponse>;

    toast({
      title:"Error in Switchingmessage",
      description : axiosError.response?.data.message
    })
  }
}

if(!session || !session.user){
  return <>
  <h1>Please , Login Your Account </h1>
  </>
}


// work on url

const  {username} = session?.user as User

// console.log("username is correct : " , username);

const baseURL  = `${window.location.protocol}//${window.location.host}`
const profileURL = `${baseURL}/u/${username}`

//copy profilr url function

const copyToClipboard  = async()=>{

  navigator.clipboard.writeText(profileURL);

toast({
  title : "URL COPY successfully..."
})

}




  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL }
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={ copyToClipboard }>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptmessage}
          onCheckedChange={handlSwitching}
          disabled={isSwitchingLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptmessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();

          fetchMessages(true);
        }}
      >
        {loading  ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
            key={message._id}
              message={message}
              onMessageDelete={handleDeletMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}
