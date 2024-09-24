"use client"
import {  useToast } from '@/hooks/use-toast';
import { Messageinterface } from '@/model/user.model'
import { acceptmessageSchema } from '@/schema/acceptmessageschema';
import { apiresponse } from '@/types/apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

export default function Page() {
  const[messages , setMessages] = useState<Messageinterface[]>([]);
  const[loading , setLoading] = useState(false);
  const[isSwitchingLoading , setisSwitchingLoading] = useState(false);

  const {toast} = useToast();


  // to optimize way update only ui
  const handleDeletMessage = async(messageId) =>{
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


  // check UseraccpetMessage
  const fetchAccpetMessage = useCallback(async() =>{

    setisSwitchingLoading(true);
    try {

      //check is accepting message

      const respone = await axios.get<apiresponse>("/api/user/accept-messages");
     //update in filed // set in variable
     setValue("acceptMessage" , respone.data.isAcceptingMessage);
      
    } catch (error) {

      const axiosError  = error as AxiosError<apiresponse>;

      toast({
        title:"Error in fetchAccpetMessage",
        description : axiosError.response?.data.message
      })

      
    } finally{

      setisSwitchingLoading(false);

    }



  },[setValue])


  //get messages
  const fetchMessages= useCallback(async(refresh:boolen = false)=>{
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

      toast({
        title:"Error in fetchAccpetMessage",
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
    
  } catch (error) {
    
  }
}





  return (
    <div>DashBord</div>
  )
}
