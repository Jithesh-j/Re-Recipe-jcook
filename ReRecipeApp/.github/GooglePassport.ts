import googleAppAuth from './googleOauth2';
import * as passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20-with-people-api';

class GooglePassport {
    clientId: string;
    secretId: string;

    constructor() {
        this.clientId = googleAppAuth.id;
        this.secretId = googleAppAuth.secret;

        console.log("Google Client ID:", this.clientId);
        console.log("Google Secret ID:", this.secretId);

        passport.use(
            new GoogleStrategy(
                {
                    clientID: this.clientId,
                    clientSecret: this.secretId,
                    callbackURL: "https://re-recipe.azurewebsites.net/app/auth/google/callback",
                },
                (accessToken, refreshToken, profile, done) => {
                    console.log("Inside new passport Google strategy");
                    process.nextTick(() => {
                        console.log('Validating Google profile:', JSON.stringify(profile));
                        console.log("userId:", profile.id);
                        console.log("displayName:", profile.displayName);
                        return done(null, profile);
                    });
                }
            )
        );

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((user, done) => {
            done(null, user);
        });
    }
}

export default GooglePassport;