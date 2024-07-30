import { Strategy as LocalAPIKeyStrategy } from "passport-localapikey-update";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import bcrypt from "bcryptjs";

import query from "./queries";
import env from "./env";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: env.JWT_SECRET
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await query.user.find({ email: payload.email });
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

const localOptions = {
  usernameField: "email"
};

passport.use(
  new LocalStrategy(localOptions, async (email, password, done) => {
    try {
      // console.log("LocalStrategy: Authenticating user with email:", email);
      const user = await query.user.find({ email });

      if (!user) {
        // console.log("LocalStrategy: Passwords do not match");
        return done(null, false);
      }


      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // console.log("LocalStrategy: Passwords do not match");
        return done(null, false);
      }
      // console.log("LocalStrategy: User authenticated successfully:", user);
      return done(null, user);
    } catch (err) {
      console.error("LocalStrategy: Error during authentication:", err);
      return done(err);
    }
  })
);

const localAPIKeyOptions = {
  apiKeyField: "apikey",
  apiKeyHeader: "x-api-key"
};


  passport.use(
    new LocalAPIKeyStrategy(localAPIKeyOptions, async (apikey, done) => {
      try {
        // console.log("LocalAPIKeyStrategy: Authenticating user with API key:", apikey);
        // Find user by API key
        const user = await query.user.find({ apikey });
        if (!user) {
          // console.log("LocalAPIKeyStrategy: User not found");
          return done(null, false);
        }
  
        // console.log("LocalAPIKeyStrategy: User authenticated successfully:", user);
        return done(null, user);
      } catch (err) {
        console.error("LocalAPIKeyStrategy: Error during authentication:", err);
        return done(err);
      }
    })
  );
