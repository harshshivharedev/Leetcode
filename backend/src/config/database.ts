import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async() => {
    try{
        await mongoose.connect(env.MONGO_URI);

        console.log("MongoDB connected successfully");
    } catch ( error ) {
        console.error("mongoDb connection failed: ", error);
        process.exit(1);
    }
}





/*
 * DATABASE CONNECTION NOTES
 *
 * 1. mongoose:
 *    MongoDB database se connect karne aur schemas/models
 *    ke through data manage karne ke liye use hota hai.
 *
 * 2. env.MONGO_URI:
 *    Validated environment configuration se MongoDB connection
 *    string milti hai. URI .env file mein defined hoti hai.
 *
 * 3. connectDatabase():
 *    Async function hai jo database connection establish karti hai.
 *
 * 4. Promise<void>:
 *    Function Promise return karta hai, lekin successfully
 *    complete hone par koi meaningful value return nahi karta.
 *
 * 5. await mongoose.connect(env.MONGO_URI):
 *    MongoDB se connection establish hone ka wait karta hai.
 *
 * 6. try-catch:
 *    Connection ke dauran aane wale errors ko handle karta hai.
 *
 * 7. process.exit(1):
 *    Database connection fail hone par process ko failure
 *    status ke saath terminate karta hai.
 *    Isse application bina database ke start nahi hoti.
 *
 * FLOW:
 * connectDatabase()
 *       -> MongoDB se connect
 *       -> Success: success log
 *       -> Failure: error log + process exit
 *
 * IMPORTANT:
 * server ko listen karane se pehle connectDatabase() ko await
 * karo, taaki database connection fail hone par API server
 * requests accept karna shuru na kare.
 */
 