import { error } from "console";
import mongoose from "mongoose";
import { DB_Name } from "../constants";

const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name} `,{});
        console.log("MongoDB Connected");
        console.log(`Connected to the database ${connectionInstance.connection.name}`);
    }
    catch (err) {
        console.error("Error connecting the database:",error);
        process.exit(1);
    }
}
export default connectDB;