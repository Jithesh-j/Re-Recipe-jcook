"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UserModel = void 0;
var mongoose = require("mongoose");
var crypto = require("crypto");
var UserModel = /** @class */ (function () {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param {string} DB_CONNECTION_STRING - MongoDB connection string.
     */
    function UserModel(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    /**
     * Defines the schema for a user.
     */
    UserModel.prototype.createSchema = function () {
        this.schema = new mongoose.Schema({
            user_ID: { type: String, required: true, unique: true },
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            hints: { type: String },
            recipeIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
        }, { collection: "users", timestamps: true });
        // Pre-save hook to hash the password
        this.schema.pre("save", function (next) {
            var user = this;
            // Only hash the password if it's new or modified
            if (!user.isModified("password"))
                return next();
            try {
                user.password = UserModel.hashPW(user.password); // Hash the password
                next();
            }
            catch (err) {
                next(err);
            }
        });
    };
    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     */
    UserModel.prototype.createModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, mongoose.connect(this.dbConnectionString)];
                    case 1:
                        _a.sent();
                        this.model = mongoose.model("User", this.schema);
                        console.log("Connected to MongoDB and created User model.");
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error creating User model:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Hashes a password using the crypto module.
     * @param {string} password - The plain text password to hash.
     * @returns {string} - The hashed password.
     */
    UserModel.hashPW = function (password) {
        return crypto.createHash("sha256").update(password).digest("base64").toString();
    };
    /**
     * Validates a user's password.
     * @param {string} inputPassword - The password provided by the user.
     * @param {string} storedPassword - The hashed password stored in the database.
     * @returns {boolean} - Whether the passwords match.
     */
    UserModel.validatePassword = function (inputPassword, storedPassword) {
        var hashedInput = UserModel.hashPW(inputPassword);
        return hashedInput === storedPassword;
    };
    /**
     * User Signup
     * @param {any} response - The response object.
     * @param {IUser} userData - The data for the new user.
     */
    UserModel.prototype.signup = function (response, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var newUser, savedUser, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userData.password = UserModel.hashPW(userData.password);
                        newUser = new this.model(userData);
                        return [4 /*yield*/, newUser.save()];
                    case 1:
                        savedUser = _a.sent();
                        response.status(201).json(savedUser);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error signing up user:", error_2);
                        response.status(400).json({ error: "Error creating user. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * User Login
     * @param {any} response - The response object.
     * @param {string} username - The username provided by the user.
     * @param {string} password - The password provided by the user.
     */
    UserModel.prototype.login = function (response, username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isPasswordValid, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOne({ username: username }).exec()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, response.status(404).json({ error: "User not found" })];
                        }
                        isPasswordValid = UserModel.validatePassword(password, user.password);
                        if (!isPasswordValid) {
                            return [2 /*return*/, response.status(401).json({ error: "Invalid credentials" })];
                        }
                        // Successful login
                        response.json({ message: "Login successful", user: user });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error during login:", error_3);
                        response.status(500).json({ error: "Error logging in. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get User Profile
     * @param {any} response - The response object.
     * @param {string} userId - The ID of the user to retrieve.
     */
    UserModel.prototype.getUserProfile = function (response, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOne({ user_ID: userId }).exec()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, response.status(404).json({ error: "User not found" })];
                        }
                        response.json(user);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error retrieving user profile:", error_4);
                        response.status(500).json({ error: "Error retrieving profile. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update User Profile
     * @param {any} response - The response object.
     * @param {string} userId - The ID of the user to update.
     * @param {Partial<IUser>} updateData - The data to update.
     */
    UserModel.prototype.updateUser = function (response, userId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (updateData.password) {
                            updateData.password = UserModel.hashPW(updateData.password); // Hash the password if updated
                        }
                        return [4 /*yield*/, this.model.findOneAndUpdate({ user_ID: userId }, updateData, { "new": true }).exec()];
                    case 1:
                        updatedUser = _a.sent();
                        if (!updatedUser) {
                            return [2 /*return*/, response.status(404).json({ error: "User not found" })];
                        }
                        response.json(updatedUser);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Error updating user:", error_5);
                        response.status(500).json({ error: "Error updating profile. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete User Profile
     * @param {any} response - The response object.
     * @param {string} userId - The ID of the user to delete.
     */
    UserModel.prototype.deleteUser = function (response, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.deleteOne({ user_ID: userId }).exec()];
                    case 1:
                        result = _a.sent();
                        if (result.deletedCount === 0) {
                            return [2 /*return*/, response.status(404).json({ error: "User not found" })];
                        }
                        response.json({ message: "User deleted successfully" });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error deleting user:", error_6);
                        response.status(500).json({ error: "Error deleting profile. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List All Users
     * @param {any} response - The response object.
     */
    UserModel.prototype.listAllUsers = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var users, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.find({}).exec()];
                    case 1:
                        users = _a.sent();
                        response.json(users);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Error listing users:", error_7);
                        response.status(500).json({ error: "Error retrieving users. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserModel;
}());
exports.UserModel = UserModel;
