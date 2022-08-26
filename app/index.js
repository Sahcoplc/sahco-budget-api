import express from "express";
import dotenv from "dotenv";
dotenv.config('.');

import morgan from "morgan";
import cors from "cors";

// Connect to DB
import connectDb from "./db/connect.js";

// Middlewares
import notFound from "./middlewares/notFound.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";

// Import routes
import homeRoutes from './routes/home.js'

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.json());

const HOSTNAME = process.env.DEV_HOST;
const PORT = process.env.DEV_PORT;


// Routes
const apiPath = "/api";
app.use(apiPath + "/", homeRoutes);

// Use middlewares
app.use(notFound);
app.use(errorHandlerMiddleware)

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