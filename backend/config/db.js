import mongoose from "mongoose";

 const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connect succesfully");
    }catch(err){

    }
}

export default connectDb;