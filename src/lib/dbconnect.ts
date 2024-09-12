import mongoose from "mongoose";



type connectionObject = { 
    isConnecte? : number;
}


const connection : connectionObject = {}


async function dbconnect() : Promise<void>{

    if(connection.isConnecte){
        console.log("database is Allread connected.....!");
        return ;
    }

    try{

        const db = await mongoose.connect(process.env.MONGODB_URL || " ");
        connection.isConnecte = db.connections[0].readyState
        console.log("database connection successfully.... : ");


    }catch(errro){
        console.log("database connection error  : ",  errro);
        //exits
        process.exit(1);
    }

}

export default dbconnect;