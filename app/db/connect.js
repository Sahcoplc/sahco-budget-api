import dotenv from 'dotenv';
dotenv.config();
import { createPool } from 'mysql2';

//Create a pool connection to the database
const connectDb = createPool({
    host: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_HOST : process.env.PROD_DB_HOST,
    user: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_USER : process.env.PROD_DB_USER,
    password: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_PASSWORD : process.env.PROD_DB_PASSWORD,
    database: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_DATABASE : process.env.PROD_DB_DATABASE,
    port: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_PORT : process.env.PROD_DB_PORT
});

export default connectDb;