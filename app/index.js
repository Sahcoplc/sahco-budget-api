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
import homeRoutes from './routes/home.js'
import userRoutes from './routes/User.js'
import authRoutes from './routes/Auth.js'
import accountRoutes from './routes/Account.js'
import budgetRoutes from './routes/Budget.js'

const app = express();
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://www.sahcoplc.com.ng', 'https://sahcoplc-budget-react.vercel.app'],
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTIONS'],
    credentials: true
};

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, UPDATE, PUT, PATCH, OPTIONS, HEAD");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
// app.use(cors(corsOptions));
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

const HOSTNAME = process.env.NODE_ENV !== 'production' ?  process.env.DEV_HOST : process.env.PRO_HOSTNAME;
const PORT =  process.env.DEV_PORT;


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
        await connectDb.promise()

        app.listen(PORT, ()=> {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

server_start()