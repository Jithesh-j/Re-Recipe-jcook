import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import * as crypto from "crypto";

class UserModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<any>;
  public dbConnectionString: string;

  /**
   * Constructor to initialize the database connection and set up the schema and model.
   * @param {string} DB_CONNECTION_STRING - MongoDB connection string.
   */
  public constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.createSchema();
    this.createModel();
  }

  /**
   * Defines the schema for a user.
   */
  public createSchema() {
    this.schema = new mongoose.Schema(
      {
        user_ID: { type: String, required: true, unique: true },
        ssoID: {type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // Stores hashed password
        hints: { type: String }, // Optional field
        recipeIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      },
      { collection: "users", timestamps: true }
    );

    // Pre-save hook to hash the password
    this.schema.pre("save", function (next) {
      const user = this as any;

      // Only hash the password if it's new or modified
      if (!user.isModified("password")) return next();

      try {
        user.password = UserModel.hashPW(user.password); // Hash the password
        next();
      } catch (err) {
        next(err);
      }
    });
  }

  /**
   * Connects to the MongoDB database and creates the Mongoose model based on the schema.
   */
  public async createModel() {
    try {
      await mongoose.connect(this.dbConnectionString);

      this.model = mongoose.model("User", this.schema);
      console.log("Connected to MongoDB and created User model.");
    } catch (error) {
      console.error("Error creating User model:", error);
    }
  }

  /**
   * Hashes a password using the crypto module.
   * @param {string} password - The plain text password to hash.
   * @returns {string} - The hashed password.
   */
  public static hashPW(password: string): string {
    return crypto.createHash("sha256").update(password).digest("base64").toString();
  }

  /**
   * Validates a user's password.
   * @param {string} inputPassword - The password provided by the user.
   * @param {string} storedPassword - The hashed password stored in the database.
   * @returns {boolean} - Whether the passwords match.
   */
  public static validatePassword(inputPassword: string, storedPassword: string): boolean {
    const hashedInput = UserModel.hashPW(inputPassword);
    return hashedInput === storedPassword;
  }

  /**
   * User Signup
   * @param {any} response - The response object.
   * @param {IUser} userData - The data for the new user.
   */
  public async signup(response: any, userData: IUser): Promise<void> {
    try {
      userData.password = UserModel.hashPW(userData.password);
      const newUser = new this.model(userData);
      const savedUser = await newUser.save();
      response.status(201).json(savedUser);
    } catch (error) {
      console.error("Error signing up user:", error);
      response.status(400).json({ error: "Error creating user. Please try again." });
    }
  }

  /**
   * User Login
   * @param {any} response - The response object.
   * @param {string} username - The username provided by the user.
   * @param {string} password - The password provided by the user.
   */
  public async login(response: any, username: string, password: string): Promise<void> {
    try {
      const user = await this.model.findOne({ username }).exec();
      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = UserModel.validatePassword(password, user.password);
      if (!isPasswordValid) {
        return response.status(401).json({ error: "Invalid credentials" });
      }

      // Successful login
      response.json({ message: "Login successful", user });
    } catch (error) {
      console.error("Error during login:", error);
      response.status(500).json({ error: "Error logging in. Please try again." });
    }
  }

  /**
   * Get User Profile
   * @param {any} response - The response object.
   * @param {string} userId - The ID of the user to retrieve.
   */
  public async getUserProfile(response: any, userId: string): Promise<void> {
    try {
      const user = await this.model.findOne({ user_ID: userId }).exec();
      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
      response.json(user);
    } catch (error) {
      console.error("Error retrieving user profile:", error);
      response.status(500).json({ error: "Error retrieving profile. Please try again." });
    }
  }

  /**
   * Update User Profile
   * @param {any} response - The response object.
   * @param {string} userId - The ID of the user to update.
   * @param {Partial<IUser>} updateData - The data to update.
   */
  public async updateUser(response: any, userId: string, updateData: Partial<IUser>): Promise<void> {
    try {
      if (updateData.password) {
        updateData.password = UserModel.hashPW(updateData.password); // Hash the password if updated
      }

      const updatedUser = await this.model.findOneAndUpdate(
        { user_ID: userId },
        updateData,
        { new: true }
      ).exec();

      if (!updatedUser) {
        return response.status(404).json({ error: "User not found" });
      }

      response.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      response.status(500).json({ error: "Error updating profile. Please try again." });
    }
  }

  /**
   * Delete User Profile
   * @param {any} response - The response object.
   * @param {string} userId - The ID of the user to delete.
   */
  public async deleteUser(response: any, userId: string): Promise<void> {
    try {
      const result = await this.model.deleteOne({ user_ID: userId }).exec();
      if (result.deletedCount === 0) {
        return response.status(404).json({ error: "User not found" });
      }

      response.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      response.status(500).json({ error: "Error deleting profile. Please try again." });
    }
  }

  /**
   * List All Users
   * @param {any} response - The response object.
   */
  public async listAllUsers(response: any): Promise<void> {
    try {
      const users = await this.model.find({}).exec();
      response.json(users);
    } catch (error) {
      console.error("Error listing users:", error);
      response.status(500).json({ error: "Error retrieving users. Please try again." });
    }
  }
}

export { UserModel };