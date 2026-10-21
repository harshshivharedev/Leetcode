
import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

const startServer = async () => {
    await connectDatabase();

    app.listen(env.PORT, () => {
        console.log(`server running on Port ${env.PORT}`)
    })
}

startServer().catch((error: unknown) => {
    console.error("Server startup fail");
    process.exit(1);
})

