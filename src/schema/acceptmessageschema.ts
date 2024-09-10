import { z} from "zod"

export const acceptmessageSchema = z.object({
    acceptMessage : z.string()

})