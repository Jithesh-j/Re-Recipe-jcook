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
      callbackURL: "http://localhost:8080/app/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Inside new passport Google strategy");
      process.nextTick(() => {
        const email = profile.emails?.[0]?.value; 
        const user = {
            id: profile.id,
            user_ID: profile.id,
            displayName: profile.displayName,
            email: email || null, 
        };
        console.log("userId:", profile.id);
        console.log("displayName:", profile.displayName);

        return done(null, user); 
      });
    }
  )
);

        passport.serializeUser(function(user, done) {
            done(null, user as Express.User);
        });

        passport.deserializeUser(function(user, done) {
            done(null, user as Express.User);
        });
    }
}

export default GooglePassport;
