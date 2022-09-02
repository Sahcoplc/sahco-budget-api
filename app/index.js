import express from "express";
import dotenv from "dotenv";
dotenv.config('.');

import morgan from "morgan";
import cors from "cors";
import path from "path";
import { create } from "express-handlebars";
import { __dirname } from "./__Globals.js";

// Connect to DB
import connectDb from "./db/connect.js";

// Middlewares
import notFound from "./middlewares/notFound.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";

// Import routes
import homeRoutes from '../app/routes/home.js'
import userRoutes from '../app/routes/User.js'
import authRoutes from '../app/routes/Auth.js'
import accountRoutes from '../app/routes/Account.js'
import budgetRoutes from '../app/routes/Budget.js'

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// Handlebars setup
app.set("view engine", "hbs");
const exphbs = create({
  layoutsDir: __dirname + "views/layout",
  extname: "hbs",
  defaultLayout: "main",
  partialsDir: __dirname + "views/partials/",
});
app.engine("hbs", exphbs.engine);
app.use(express.static(path.join(__dirname, "/public")));

const HOSTNAME = process.env.DEV_HOST;
const PORT = process.env.DEV_PORT;


// Routes
const apiPath = "/api";
app.use(apiPath + "/", homeRoutes);
app.use(apiPath + '/auth', authRoutes)
app.use(apiPath + '/users', userRoutes);
app.use(apiPath + '/account', accountRoutes);
app.use(apiPath + '/budget', budgetRoutes);


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