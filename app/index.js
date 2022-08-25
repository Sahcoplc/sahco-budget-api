import express from "express";
import dotenv from "dotenv";
dotenv.config('.');

const app = express();
app.use(express.json());

const HOSTNAME = process.env.HOST;
const PORT = process.env.PORT;
app.listen(PORT, HOSTNAME, ()=> {
    console.log(`Server is running on port ${PORT}`)
})