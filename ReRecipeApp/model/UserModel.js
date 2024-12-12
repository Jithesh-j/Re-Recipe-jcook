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
var CookbookModel_1 = require("./CookbookModel");
var DiscoverModel_1 = require("./DiscoverModel");
var UserModel = /** @class */ (function () {
    function UserModel(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        var discoverModel = new DiscoverModel_1.DiscoverModel(this.dbConnectionString);
        this.cookbookModel = new CookbookModel_1.CookbookModel(this.dbConnectionString, discoverModel);
        this.createSchema();
        this.createModel();
    }
    UserModel.prototype.createSchema = function () {
        this.schema = new mongoose.Schema({
            user_ID: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            displayName: { type: String, required: true },
            color: { type: String, required: true }
        }, { collection: "users", timestamps: true });
    };
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
    // Creates a user entry in the DB
    UserModel.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultColor, newUser, savedUser, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        defaultColor = "#000000";
                        newUser = new this.model({
                            user_ID: userData.user_ID,
                            email: userData.email,
                            displayName: userData.displayName,
                            color: defaultColor
                        });
                        return [4 /*yield*/, newUser.save()];
                    case 1:
                        savedUser = _a.sent();
                        console.log("New user created:", savedUser);
                        // Create a default cookbook for the user
                        return [4 /*yield*/, this.cookbookModel.createCookbook(userData.user_ID, "myCookbook")];
                    case 2:
                        // Create a default cookbook for the user
                        _a.sent();
                        return [2 /*return*/, savedUser];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Error creating user:", error_2);
                        throw new Error("User creation failed.");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Looks for a user in the db and if doesn't have one calls to the create
    UserModel.prototype.findOrCreateUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.model
                                .findOne({ user_ID: userData.user_ID })
                                .exec()];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            console.log("Existing user found:", user);
                            return [2 /*return*/, user];
                        }
                        return [4 /*yield*/, this.createUser(userData)];
                    case 2: 
                    // If no user exists, create a new one
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error during find or create user:", error_3);
                        throw new Error("User lookup or creation failed.");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Get user profile
    UserModel.prototype.getUserProfile = function (response, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOne({ user_ID: userId })
                                .select("displayName email user_ID") // Only fetch displayName and email
                                .exec()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, response.status(404).json({ error: "User not found" })];
                        }
                        response.json({
                            name: user.displayName,
                            email: user.email,
                            user_id: user.user_ID
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error retrieving user profile:", error_4);
                        response
                            .status(500)
                            .json({ error: "Error retrieving profile. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserModel.prototype.updateUser = function (response, userId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOneAndUpdate({ user_ID: userId }, updateData, { "new": true })
                                .exec()];
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
                        response
                            .status(500)
                            .json({ error: "Error updating profile. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
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
                        response
                            .status(500)
                            .json({ error: "Error deleting profile. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
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
                        response
                            .status(500)
                            .json({ error: "Error retrieving users. Please try again." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserModel;
}());
exports.UserModel = UserModel;
