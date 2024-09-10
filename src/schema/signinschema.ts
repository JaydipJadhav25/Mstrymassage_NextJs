import { z} from "zod"

export const signinSchema = z.object({
    
   

     identifire : z.string(),
     password : z.string()

})