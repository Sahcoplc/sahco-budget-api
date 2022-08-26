import express from "express";
import dotenv from "dotenv";
dotenv.config('.');

import morgan from "morgan";
import cors from "cors";
import connectDb from "./db/connect.js";

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.json());

const HOSTNAME = process.env.DEV_HOST;
const PORT = process.env.DEV_PORT;

/**
 * HANDLING UNCAUGHT EXCEPTION ERRORS
 * Process.traceDeprecation = true;
 */

//simple route
app.get('/', (req, res) => {
    res.json({message: 'Welcome to Skyway Aviation Handling Company Budget Management Application API.'});
})

process.on("uncaughtException", (err) => {
    console.log(
      `UNCAUGHT EXCEPTION! Server Shutting down...\n
        ${err.name} \n ${err.message} \n ${err.stack}`
    );
    process.exit(1);
});

const server_start = async () => {
    try {
        // Open Mysql Connection
        await connectDb.connect((error => {
            if (error) throw error;
            console.log('Successfully connected to the database.');
        }))
        app.listen(PORT, HOSTNAME, ()=> {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

server_start()