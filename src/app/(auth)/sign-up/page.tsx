"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {  useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schema/signupschema"
import axios ,{ AxiosError} from "axios"
import { apiresponse } from "@/types/apiresponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"



const Page = () => {

  const [username , setUsername] =useState('');
  const [usernameMessage , setUsernaemMessage] = useState('');
  const [isCheckingUsername , setisCheckingUsername] = useState(false);
const [ isSubmiting , setIsSubmiting] = useState(false);


const { toast } = useToast()
const router = useRouter();

// console.log(isCheckingUsername , usernameMessage)
//value nhi set krta ye directly callback pass
//username 3sec ye set honar
const debounced = useDebounceCallback(setUsername , 300)

console.log("username vlaue  : " , username)
const form = useForm({
  resolver : zodResolver(signupSchema),
  defaultValues : {
    username : '',
    email : '',
    password : ''

  }
})


//username check
useEffect(() => {

  const checkUsernameUqine  = async () =>{
      if(username){
        setisCheckingUsername(true);
        setUsernaemMessage('');
        try {
          
          //usernaem send in url
     const response  =  await axios.get(`/api/user/check-username-uniqu?username=${username}`)
     console.log("respone : " , response);

     //set usernameMessage
    //  let message = response.data.message;
     console.log("username api respone : " ,response.data.message)
     setUsernaemMessage(response.data.message);



        } catch (error) {
 
          const exiosError = error as AxiosError<apiresponse>;
           console.log("error : " , exiosError)
          setUsernaemMessage(exiosError.response?.data.message ?? "Error checking username");
          console.log("error : " , exiosError.response?.data.message)
           
          
        } finally{
          
          setisCheckingUsername(false);
        }
      }
  }

   checkUsernameUqine(); //call

} , [username ])

//handle form data
const onSubmite = async(data : z.infer<typeof signupSchema>) =>{
  console.log("data : " , data);
  //active loading
  setIsSubmiting(true)

  try {

    const respone = await axios.post(`/api/user/signup/` , data);
    console.log("respone : " , respone);

    //tost message
    toast({
      title : "success",
      description : respone.data.message
    })

    //redirect user
    router.replace(`/verify/${username}`)

    //done
    setIsSubmiting(false);

  } catch (error) {

    console.log(error);
    const exiosError = error as AxiosError<apiresponse>;

 const errorMessage = exiosError.response?.data.message

 toast({
  title : "signup failed",
  description : errorMessage,
  variant : "destructive"
 })

 setIsSubmiting(false);

    
  }

}


  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmite)} className="space-y-6">

  <FormField
  name="username"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="username"
        {...field} 
        onChange={(e) =>{
          field.onChange(e)
          //username check sathi
          // setUsername(e.target.value);
          debounced(e.target.value); // pass value to set on delay
        }}
        />
        </FormControl>
        {isCheckingUsername && <Loader2 className="animate-spin" />}
       
           {!isCheckingUsername && usernameMessage && (
             <p
             className={`text-sm ${
               usernameMessage === 'Username is unique'
                 ? 'text-green-500'
                 : 'text-red-500'
             }`}
           >
            test {usernameMessage}
           </p>
           )}
         
        <FormMessage />
      </FormItem>
       )}
      />

<FormField
  name="email"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="email"
        {...field} 
        />
        </FormControl>
        <FormMessage />
      </FormItem>
       )}
      />

<FormField
  name="password"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <Input placeholder="password" type="password"
        {...field} 
        />
        </FormControl>
        <FormMessage />
      </FormItem>
       )}
      />
   
  <Button type="submit" disabled={isSubmiting}>
  {isSubmiting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
  </Button>

          </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    
  )
}

export default Page;
