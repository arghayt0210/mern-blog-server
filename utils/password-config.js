const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user/user");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth
// JWT
// JWT Options
const options = {
  jwtFromRequest: ExtractJWT.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["token"];
      }
      return token;
    },
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTstrategy(options, async (userDecoded, done) => {
    try {
      const user = await User.findById(userDecoded.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const {
          id,
          displayName,
          _json: { picture },
        } = profile;

        // check if email exists
        let email = "";
        if (Array.isArray(profile?.emails) && profile?.emails?.length > 0) {
          email = profile.emails[0].value;
        }

        existingUser = await User.create({
          username: displayName,
          googleId: id,
          profilePicture: picture,
          authMethod: "google",
          email,
        });

        return done(null, existingUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
