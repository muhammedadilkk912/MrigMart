import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/config/Db.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import publicRoutes from './src/routes/publicRoutes.js'
 import './src/config/passport.js'  
import authRoutes from './src/routes/authRoutes.js'
import passport from "passport";
import userRoutes from './src/routes/userRoutes.js'
import webhookHandler from "./src/controller/webhookHandler.js";
    
dotenv.config()


const app=express()
console.log("secret key=",process.env.STRIPE_SECRET_KEY)
app.use(cors({  
    // origin: 'http://localhost:5173',
    origin:'https://mrig-mart-iuk2.vercel.app/',
    credentials: true // ✅ Important for cookies/sessions
}));
app.use(passport.initialize())
connectDb()
app.use(cookieParser());
app.use('/webhook',express.raw({type:'application/json'}),webhookHandler)

app.use(express.json()) 
app.use('/api/auth',authRoutes)
app.use('/api',publicRoutes)
app.use('/api/user',userRoutes)
// app.use('/payment-success',(req,res)=>{
//     res.send('completed')
// })



const port=process.env.port || '999'
app.listen(port,()=>{
    console.log(`the server running at ${port}`)
})