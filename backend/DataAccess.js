"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAccess = void 0;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();
class DataAccess {
    constructor() {
        DataAccess.connect();
    }
    static connect() {
        if (this.mongooseInstance)
            return this.mongooseInstance;
        this.mongooseConnection = mongoose.connection;
        this.mongooseConnection.on('open', () => {
            console.log('Connected to MongoDB successfully.');
        });
        this.mongooseConnection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        this.mongooseInstance = mongoose.connect(this.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return this.mongooseInstance;
    }
}
exports.DataAccess = DataAccess;
DataAccess.DB_CONNECTION_STRING = process.env.DB_INFO || '';
//# sourceMappingURL=DataAccess.js.map