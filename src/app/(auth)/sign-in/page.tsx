"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
// import Link from "next/link"
// import { useState } from "react"
import { signinSchema } from "@/schema/signinschema"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"



const Page = () => {


//   const [isCheckingUsername , setisCheckingUsername] = useState(false);
// const [ isSubmiting , setIsSubmiting] = useState(false);


const { toast } = useToast()
const router = useRouter();

// console.log(isCheckingUsername , usernameMessage)
//value nhi set krta ye directly callback pass
//username 3sec ye set honar


const form = useForm<z.infer<typeof  signinSchema >>({
  resolver : zodResolver( signinSchema ),
  defaultValues : {

    identifier : '',
    password : ''

  }
})



//handle form data
const onSubmite = async(data : z.infer<typeof signinSchema >) =>{
  console.log("data : " , data);

   //signin using next auth
  const result  =  await signIn('credentials' , {
    redirect : false,
    identifier : data.identifier,
    password : data.password
   })

   console.log("result : " , result);



   if(result?.error){
    const authErro = result.error
    console.log("authError : " , authErro);
    toast({
      title : "Login failed",
      description : `${authErro}`,
      variant : 'destructive'
    })
   }

   if(result?.url)router.replace("/dashbord")

}


  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmite)} className="space-y-6">


<FormField
  name="identifier"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email / Username</FormLabel>
      <FormControl>
        <Input placeholder="email /Username"
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
   
  <Button type="submit">
  SignIn
  </Button>

          </form>

        </Form>
        {/* <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div> */}
      </div>
    </div>
    
  )
}

export default Page;
