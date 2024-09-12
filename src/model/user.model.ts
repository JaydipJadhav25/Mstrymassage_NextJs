import mongoose , {Schema , Document} from "mongoose";


export interface Messageinterface extends Document{
       content : string;
       createdAt : Date;
};


const messageSchema : Schema<Messageinterface> = new Schema({

     content : {
        type : String,
        required : true
     },
     createdAt : {
        type : Date,
        required : true,
        default : Date.now
     }
})


//user interface // datetype


export interface Userinterface extends Document{
    username : string;
    email : string;
    password : string;
    verifycode : string;
    isverifyfied : boolean;
    verifycodeExpiry : Date;
    isAcceptingMassage : boolean;
    messages : Messageinterface[]
}


const userSchema : Schema<Userinterface> = new Schema({
    username :{
        type : String,
        required: [true, " username is requried...."],
        trim : true,
        unique : true
    },
    email :{
        type : String,
        required: [true, " email is requried...."],
        trim : true,
        unique : true
    },

    password :{
        type : String,
        required: [true, " password is requried...."],
    },
    verifycode : {
        type : String,
        required: [true, " verifycode is requried...."],
    },

    isverifyfied : {
        type : Boolean,
        default : false

    },
    verifycodeExpiry : {
        type : Date , 
        required : true
    },

    isAcceptingMassage : {
        type : Boolean,
        defult : true
    },
    messages : [messageSchema]

})



// export model handling two cases :
//1 .moddel in already create
//2. new model create
// add type script to defind type of model  //datetype

const userModel = (mongoose.models.user as mongoose.Model<Userinterface>) || (mongoose.model<Userinterface>("user" , userSchema));

export default userModel;