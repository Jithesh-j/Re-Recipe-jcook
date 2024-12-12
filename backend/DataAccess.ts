import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class DataAccess {
  static mongooseInstance: any;
  static mongooseConnection: mongoose.Connection;
  static DB_CONNECTION_STRING: string = process.env.DB_INFO || '';

  constructor() {
    DataAccess.connect();
  }

  static connect(): mongoose.Connection {
    if (this.mongooseInstance) return this.mongooseInstance;

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

export { DataAccess };