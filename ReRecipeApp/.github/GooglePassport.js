"use strict";
exports.__esModule = true;
var googleOauth2_1 = require("./googleOauth2");
var passport = require("passport");
var passport_google_oauth20_with_people_api_1 = require("passport-google-oauth20-with-people-api");
var GooglePassport = /** @class */ (function () {
    function GooglePassport() {
        this.clientId = googleOauth2_1["default"].id;
        this.secretId = googleOauth2_1["default"].secret;
        console.log("Google Client ID:", this.clientId);
        console.log("Google Secret ID:", this.secretId);
        passport.use(new passport_google_oauth20_with_people_api_1.Strategy({
            clientID: this.clientId,
            clientSecret: this.secretId,
            callbackURL: "https://re-recipe.azurewebsites.net/app/auth/google/callback"
        }, function (accessToken, refreshToken, profile, done) {
            console.log("Inside new passport Google strategy");
            process.nextTick(function () {
                console.log('Validating Google profile:', JSON.stringify(profile));
                console.log("userId:", profile.id);
                console.log("displayName:", profile.displayName);
                return done(null, profile);
            });
        }));
        passport.serializeUser(function (user, done) {
            done(null, user);
        });
        passport.deserializeUser(function (user, done) {
            done(null, user);
        });
    }
    return GooglePassport;
}());
exports["default"] = GooglePassport;
