import express from "express";
import dotenv from "dotenv";
import http from 'http'
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { __dirname } from "./__Globals.js";
import notFound from "./middlewares/notFound.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";
import { apiBusy, rateLimiter } from "./middlewares/rateLimit.js";
import authMiddleware from "./base/auth.js";
import { io } from "./helpers/socket.js";

dotenv.config();

// Import routes
import routes from './routes/home.js'

const app = express();

app.use(compression());
app.set("trust proxy", 1);
app.use(express.json({ limit: "3MB" }));
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);

const getOrigin = (origin, callback) => {
    const allowedOrigin =
      !origin ||
      ["localhost", "sahcoplc.com.ng"].some((value) =>
        origin.includes(value)
      );
    if (allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
};

const corsOptions = {
    credentials: true,
    origin: getOrigin,
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(helmet());

global.__basedir = `${__dirname}\\assets`;

// Routes
app.use("/api", authMiddleware, routes);


// Use middlewares
app.use(notFound);
app.use(errorHandlerMiddleware)
app.use(rateLimiter);
app.use(apiBusy);

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

io.attach(server, {
    cors: {
      origin: getOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
});
  
export default server;