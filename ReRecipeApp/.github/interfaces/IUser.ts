import Mongoose = require("mongoose");

interface IUser extends Mongoose.Document {
  user_ID: string; // SSO ID 
  email: string; // User's email address
  color: string//
  recipeIDs: Mongoose.Types.ObjectId[]; // Array of ObjectIds referencing Recipe model
}

export { IUser };
