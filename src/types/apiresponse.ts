import { Messageinterface } from "@/model/user.model";

export interface apiresponse{
    success : boolean;
    message : string;
    isAccesptingMessage? : boolean;
    messages? : Array<Messageinterface>;
}