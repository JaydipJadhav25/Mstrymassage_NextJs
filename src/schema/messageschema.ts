import { z} from "zod"

export const messageSchema = z.object({
   content : z 
   .string()
   .min(10 , { message : " message content must be atleast of 10 char"})
   .max(300 , { message : " message content not longer than 300 char"})

})

