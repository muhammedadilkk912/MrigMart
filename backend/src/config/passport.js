// const GoogleStrategy = require('passport-google-oauth20').Strategy;
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import userModel from '../model/user.js';

  
console.log("passport outer")
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://mrigmart-backend.onrender.com/api/auth/google/callback"
    // callbackURL: "http://localhost:5444/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {  
      console.log('inside the passportjs')
      let user = await userModel.findOne({
  $or: [
    { googleId: profile.id },
    { email: profile.emails[0].value }
  ]
});

      console.log(profile)
      console.log("user=",user)

      if (!user) {
        user = new userModel({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
          isVerified: true,
          status: "Active",
          role: "user"
        });
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      console.log("error in passport =",err)
      // Check for duplicate key error
      if (err.code === 11000) {
        return done(new Error("A user with this email already exists."), null);
      }
      return done(err, null);
    }
  }
));


export default passport
