import dotenv from 'dotenv';
import { DataSource } from "typeorm"
import Account from '../models/Account.js';
import Budget from '../models/Budget.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
dotenv.config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_HOST : process.env.PROD_DB_HOST,
    username: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_USER : process.env.PROD_DB_USER,
    password: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_PASSWORD : process.env.PROD_DB_PASSWORD,
    database: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_DATABASE : process.env.PROD_DB_DATABASE,
    port: process.env.NODE_ENV !== "production" ? process.env.DEV_DB_PORT : process.env.PROD_DB_PORT,
    entities: [User, Budget, Account, Notification],
    synchronize: true,
    logging: true,
    connectorPackage: 'mysql2'
})
// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap

export default AppDataSource