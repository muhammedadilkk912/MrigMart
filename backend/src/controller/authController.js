import userModel from '../model/user.js'
import otp_generator from 'otp-generator'
import bcrypt from 'bcrypt'
import sendMail from '../utils/nodemailer.js'
import jwt from 'jsonwebtoken'

const signup = async (req, res) => {
  console.log("sign in");
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await userModel.findOne({ email });

    const otp = otp_generator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already exists" });
      } else {
        // update existing unverified user
        user.username = username;
        user.password = hashedPassword;
        user.otp = otp;
        user.otpExpires = otpExpires; // or 'Inactive' if you prefer
        await user.save();
      }
    } else {
      // create a new user
      const newUser = new userModel({
        email,
        username,
        password: hashedPassword,
        otp,
        otpExpires,
        status: 'Active',
        isVerified: false,
        // role: 'user' // if applicable
      });
      await newUser.save();
    }

    const emBody = `
      <p>Welcome to PetCare Platform!</p>
      <p>We are very happy to have you as part of us.</p>
      <p>Your verification code is: <strong>${otp}</strong></p>
    `;
    await sendMail(email, 'Sign Up Verification', emBody);

    return res.status(200).json({ message: 'OTP sent to your registered email' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp=async(req,res)=>{
    const{otp,email}=req.body
    console.log("the otp",req.body);
    
    try {
        
         if(!otp || !email){
            return   res.status(400).json({message:"otp and email are required"})
         }
    const user=await userModel.findOne({email})
    if(!user){
        return  res.status(400).json({message:"invalid  user"})
    }
    if(new Date() > user.otpExpires){
        return res.status(400).json({ message: "Invalid or expired OTP" });


      }
    if ( user.otp !== otp ) {
        return res.status(400).json({ message: "Invalid  OTP" });

      }
      
        user.isVerified=true;
        user.otp=null;
        user.otpExpires=null
        await user.save();
     res.status(200).json({ message: "OTP verification  completed!" });
        
    } catch (error) {
        console.log("verify the otp error",error);
        res.status(500).json({message:"internal server error"})
        
        
    }
}
const signin=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({message:"all fields are required"})
    }
    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:'No account ,please register..!'})
        }
        const match= await bcrypt.compare(password,user.password)
        console.log("match=",match)
        if(!match){
            return res.status(400).json({message:'password do not match'})
        }
        //send data to the fronted
       const token=jwt.sign({ id:user._id,role:user.role }, process.env.JWT_SECRET, {
            expiresIn: "5h",
        });
       
        // Set the JWT in a cookie
        res.cookie("token", token, {
          httpOnly: true,

          secure: process.env.NOD_ENV==='production', // Required for SameSite=None
          sameSite:process.env.NOD_ENV==='production'? "none":'lax', // Allows cross-site cookie
          maxAge: 5 * 60 * 60 * 1000, // 5 hour
        });
        res.status(200).json({message:'login successfull'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'internal server error'})
        
    }

}
const resendotp=async(req,res)=>{
      const {email}=req.body
    if(!email)
    {
      return   res.status(400).json({message:"email not found"})
    }

    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"No account found with that email"})

        }
          user.otp=otp_generator.generate(4,{ upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
          user.otpExpire=new Date(Date.now()+5*60000);
          let text=`<p>verification OTP : <Strong>${otp}</Strong></p>`
          await sendMail(email,'OTP for verification',text)
          await user.save()
          res.status(200).json({message:'resend otp to registered email'})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
        
    }
}

const checkauth=async(req,res)=>{
    const token =req?.cookies?.token
    console.log("token=",token)
    if(!token){
        return res.status(400).json({message:'token expired'})
    }
    const user=jwt.verify(token,process.env.JWT_SECRET)
    console.log('user=',user) 
    // let status
    // try {
    //     const res=await sellerModel.findOne({_id:seller.id})
    //     console.log("response=",res)  
    //     status=res.status
    // } catch (error) {
    //     return res.status(500).json({message:"internal server error"})
        
    // }
    res.status(200).json({message:"atuhentication checking successfull"})


}

export  {signup,signin,verifyOtp,resendotp,checkauth}   