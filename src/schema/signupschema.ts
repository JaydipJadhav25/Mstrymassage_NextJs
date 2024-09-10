import { z } from "zod"



export const usernamevalidation = z.
            string()
            .min(4 ,  { message : 'userename is atleat must be 4 charters'})
            .max(10)
            .regex(/^[a-zA-Z0-9]+$/, {
                message: "Username can only contain letters and digits.",})

            


export const signupSchema = z.object({
    
    username : usernamevalidation,

    email : z.string().email("emial is not valide address"),

    password : z.string().min(6 , "password is must be 6 letter")

})
