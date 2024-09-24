import { Messageinterface } from "@/model/user.model";

export interface apiresponse{
    success : boolean;
    message : string;
    isAcceptingMessage? : boolean;
    messages? : Array<Messageinterface>;
}