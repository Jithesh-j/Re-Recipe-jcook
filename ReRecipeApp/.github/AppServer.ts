const express = require('express');
const path = require('path');
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
const mongoStore = require('connect-mongo');
import { App } from './App';

dotenv.config();

const port = process.env.PORT || 8080;
const mongoDBConnection = process.env.DB_INFO;

console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);

let server: any = new App(mongoDBConnection).expressApp;

server.use(cookieParser());

// Todo : move this?
server.use(
  expressSession({
    secret: '1234567890QWERTY',
    cookie: { maxAge: 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: mongoDBConnection,
      collectionName: 'sessions',
    }),
  })
);

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});