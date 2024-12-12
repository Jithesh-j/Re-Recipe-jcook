"use strict";
exports.__esModule = true;
var express = require('express');
var path = require('path');
var dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var mongoStore = require('connect-mongo');
var App_1 = require("./App");
dotenv.config();
var port = process.env.PORT || 8080;
var mongoDBConnection = process.env.DB_INFO;
console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);
var server = new App_1.App(mongoDBConnection).expressApp;
server.use(cookieParser());
// Todo : move this?
server.use(expressSession({
    secret: '1234567890QWERTY',
    cookie: { maxAge: 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: mongoDBConnection,
        collectionName: 'sessions'
    })
}));
server.listen(port, function () {
    console.log("server running on port ".concat(port));
});
