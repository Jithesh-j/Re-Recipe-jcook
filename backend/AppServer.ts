const express = require('express');
const path = require('path');
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import { App } from './App';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

const port = process.env.PORT || 8080;
const mongoDBConnection = process.env.DB_INFO;

console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);

let server: any = new App(mongoDBConnection).expressApp;

server.use(cookieParser());

const cors = require('cors');

server.use(cors({
  origin: 'http://localhost:4200', // Replace with your frontend URL
  credentials: true // Allow sending cookies with requests
}));


server.listen(port, () => {
  console.log(`server running on port ${port}`);
});