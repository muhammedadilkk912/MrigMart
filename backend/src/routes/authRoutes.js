import express from "express";
import {signup,verifyOtp,resendotp,signin,checkauth,forgetpassword,resetPassword} from '../controller/authController.js'
import passport from 'passport'
import JWT from 'jsonwebtoken'

const router=express.Router()

  
 router.post('/signup',signup) 
 router.post('/verifyOtp',verifyOtp)
 router.post('/resendotp',resendotp)  
 router.post('/signin',signin)
 router.get('/checkauth',checkauth)
 router.post('/forget-password',forgetpassword)
 router.put('/resetpassword/:email',resetPassword)



// Start Google OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] ,session:false}))




// Google OAuth callback 
router.get(  
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login",session:false }),
    (req, res) => {
        console.log("inside google call back");
        
        // Generate a JWT
        const token = JWT.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: "5h",
        });

      
        // Set the JWT in a cookie 
        res.cookie("token", token, {
          httpOnly: true,

          secure: process.env.NOD_ENV==='production', // Required for SameSite=None
          sameSite:process.env.NOD_ENV==='production'? "none":'', // Allows cross-site cookie
          maxAge: 5 * 60 * 60 * 1000, // 5 hour
        });

        // Redirect to a protected route
        res.redirect(process.env.Base_Origin);
    }
);



export default router  