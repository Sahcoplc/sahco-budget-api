import express from "express";
import dotenv from "dotenv";
dotenv.config('.');

const app = express();
app.use(express.json());

const HOSTNAME = process.env.HOST;
const PORT = process.env.PORT;

/**
 * HANDLING UNCAUGHT EXCEPTION ERRORS
 * Process.traceDeprecation = true;
 */

process.on("uncaughtException", (err) => {
    console.log(
      `UNCAUGHT EXCEPTION! Server Shutting down...\n
        ${err.name} \n ${err.message} \n ${err.stack}`
    );
    process.exit(1);
});

app.listen(PORT, HOSTNAME, ()=> {
    console.log(`Server is running on port ${PORT}`)
})