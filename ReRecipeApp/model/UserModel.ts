import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { CookbookModel } from "./CookbookModel"; 
import { DiscoverModel } from "./DiscoverModel";

class UserModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<any>;
  public dbConnectionString: string;
  private cookbookModel: CookbookModel;

  constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    const discoverModel = new DiscoverModel(this.dbConnectionString);
    this.cookbookModel = new CookbookModel(this.dbConnectionString, discoverModel); 
    this.createSchema();
    this.createModel();
  }

  public createSchema() {
    this.schema = new mongoose.Schema(
      {
        user_ID: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        color: { type: String, required: true },
      },
      { collection: "users", timestamps: true }
    );
  }

  public async createModel() {
    try {
      await mongoose.connect(this.dbConnectionString);
      this.model = mongoose.model("User", this.schema);
      console.log("Connected to MongoDB and created User model.");
    } catch (error) {
      console.error("Error creating User model:", error);
    }
  }

  // Creates a user entry in the DB
  public async createUser(userData: Partial<IUser>): Promise<mongoose.Document> {
    try {
      const defaultColor = "#000000";
  
      const newUser = new this.model({
        user_ID: userData.user_ID,
        email: userData.email,
        displayName: userData.displayName,
        color: defaultColor,
      });
  
      const savedUser = await newUser.save();
      console.log("New user created:", savedUser);
  
      // Create a default cookbook for the user
      await this.cookbookModel.createCookbook(userData.user_ID, "myCookbook");
  
      return savedUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("User creation failed.");
    }
  }

  // Looks for a user in the db and if doesn't have one calls to the create
  public async findOrCreateUser(
    userData: Partial<IUser>
  ): Promise<mongoose.Document> {
    try {
      // Check if the user already exists in the database
      const user = await this.model
        .findOne({ user_ID: userData.user_ID })
        .exec();

      if (user) {
        console.log("Existing user found:", user);
        return user;
      }

      // If no user exists, create a new one
      return await this.createUser(userData);
    } catch (error) {
      console.error("Error during find or create user:", error);
      throw new Error("User lookup or creation failed.");
    }
  }

  // Get user profile
  public async getUserProfile(response: any, userId: string): Promise<void> {
    try {
      const user = await this.model
        .findOne({ user_ID: userId })
        .select("displayName email user_ID") // Only fetch displayName and email
        .exec();

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

      response.json({
        name: user.displayName,
        email: user.email,
        user_id: user.user_ID,
      });
    } catch (error) {
      console.error("Error retrieving user profile:", error);
      response
        .status(500)
        .json({ error: "Error retrieving profile. Please try again." });
    }
  }

  public async updateUser(
    response: any,
    userId: string,
    updateData: Partial<IUser>
  ): Promise<void> {
    try {
      const updatedUser = await this.model
        .findOneAndUpdate({ user_ID: userId }, updateData, { new: true })
        .exec();

      if (!updatedUser) {
        return response.status(404).json({ error: "User not found" });
      }

      response.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      response
        .status(500)
        .json({ error: "Error updating profile. Please try again." });
    }
  }

  public async deleteUser(response: any, userId: string): Promise<void> {
    try {
      const result = await this.model.deleteOne({ user_ID: userId }).exec();
      if (result.deletedCount === 0) {
        return response.status(404).json({ error: "User not found" });
      }

      response.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      response
        .status(500)
        .json({ error: "Error deleting profile. Please try again." });
    }
  }

  public async listAllUsers(response: any): Promise<void> {
    try {
      const users = await this.model.find({}).exec();
      response.json(users);
    } catch (error) {
      console.error("Error listing users:", error);
      response
        .status(500)
        .json({ error: "Error retrieving users. Please try again." });
    }
  }
}

export { UserModel };