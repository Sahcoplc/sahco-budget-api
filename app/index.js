import express from "express";
import dotenv from "dotenv";
import http from 'http'
dotenv.config('.');

import morgan from "morgan";
import cors from "cors";
import path from "path";
import { create } from "express-handlebars";
import { __dirname } from "./__Globals.js";
import helmet from "helmet";
import jwt from "jsonwebtoken";

// Connect to DB with TypeORM
import AppDataSource from "./db/connect.js";

// Middlewares
import notFound from "./middlewares/notFound.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";

//Socket
import { Server } from "socket.io";

import UserService from "./services/User.service.js";

// Import routes
import homeRoutes from './routes/home.js'
import userRoutes from './routes/User.js'
import authRoutes from './routes/Auth.js'
import accountRoutes from './routes/Account.js'
import budgetRoutes from './routes/Budget.js'
import notifyRoutes from './routes/Notification.js'

const app = express();

app.use(helmet())
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

const HOSTNAME = process.env.NODE_ENV !== 'production' ?  process.env.DEV_HOST : process.env.PRO_HOSTNAME;
let PORT =  process.env.PORT || process.env.DEV_PORT;

// Routes
const apiPath = "/api";
app.use(apiPath + "/", homeRoutes);
app.use(apiPath + '/auth', authRoutes)
app.use(apiPath + '/users', userRoutes);
app.use(apiPath + '/account', accountRoutes);
app.use(apiPath + '/budget', budgetRoutes);
app.use(apiPath + '/notification', notifyRoutes)


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

// Sockets emits
const server = http.createServer(app)

// Socket setup
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

// Socket middleware
// io.use( async (socket, next) => {

//     const { auth } = socket.handshake.headers;
    
//     console.log(auth)
//     const userService = new UserService();
  
//     if(!auth || !auth.startsWith("Bearer ")) {

//         io.send("No token provided")
  
//     //   throw new UnauthenticatedError("No token provided");
  
//     } else {
  
//       const token = auth.split(" ")[1];
  
//       if(token) {
  
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
//         const { email } = decoded;
      
//         const user = await userService.findEmail(email)
  
  
//         if(!user) {
  
//             io.send("Not authorized to access this route")
//         //   throw new UnauthenticatedError("Not authorized to access this route");
//         }
  
//         socket.user = user;
//         console.log(socket.user)
  
//         return next();
//       }
  
//     }
  
// })

io.on("connection", (socket) => {
    console.log("Made socket connection");
    // console.log(socket.id)

    socket.on('joinNotification', (params) => {
        console.log(params)
        if(params.role === 'ADMIN') {
            socket.join('ADMIN ROOM')
            console.log('joined')
        } else {
            socket.join('USER ROOM')
            console.log('user joined')
        }
    })
    socket.on('newBudget', (data) => {
        console.log(data)
        socket.to('ADMIN ROOM').emit('newBudget', {message: 'A new budget record has been added'})
    })

    socket.on('updateBudget', (data) => {
        console.log(data)
        socket.to('ADMIN ROOM').emit('updateBudget', {message: 'A budget record has been updated'})
    })

    socket.on('deleteBudget', (data) => {
        console.log(data)
        socket.to('ADMIN ROOM').emit('deleteBudget', {message: 'A budget record has been deleted'})
    })

    socket.on('approveBudget', (data) => {
        console.log(data)
        socket.emit('approveBudget', {message: 'A budget record has been approved'})
    })

    socket.on('declineBudget', (data) => {
        console.log(data)
        socket.emit('declineBudget', {message: 'A budget record has been declined'})
    })
});

const server_start = async () => {
    try {
        // Open Mysql Connection

        AppDataSource.initialize()
        .then(() => {
                // here you can start to work with your database
                console.log('Database initialized')
        })
        .catch((error) => console.log(error))

        if (PORT == '' || PORT == null) {
            PORT = 8003
        }

        server.listen(PORT, ()=> {
            console.log(`Server is running on port ${PORT}`)
        })

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

server_start()