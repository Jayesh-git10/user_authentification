import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';
import transporter from '../conifg/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../conifg/emailTemplates.js';
export const register = async (req,res) =>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({success : false , message : "Missing Details"});
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success:false , message: "An user already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({name,email,password : hashedPassword});
        await user.save();

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET,{expiresIn : '7d'});

        res.cookie('token',token ,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.nextTick.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7*24*60*60*1000
        });
        //sending welcome email;
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : 'Welcome to MySite',
            text : `Welcome to MySite . Your Account has been created with email id : ${email}`
        } 

        await transporter.sendMail(mailOptions);

        return res.json({success:true});
        
    } catch (error) {
        res.json({success:false , message : error.message});
    }

}

export const login = async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.json({success : false , message : "Email and password are required"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success : false, message : "Invalid Email"});
        }

        const isMatch =await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success : false , message : "Invalid Password"});
        }
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET,{expiresIn : '7d'});
        res.cookie('token',token ,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.nextTick.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7*24*60*60*1000
        });

        return res.json({success: true});

    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}

export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.nextTick.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({success : true, message : "Logged Out"});
    } catch (error) {
        res.json({success:false , message : error.message});
    }
}

export const sendVerifyOtp = async(req,res)=>{
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);
        if(user.isAccountVerified ){
            res.json({success : false , message : "Account Already Verified"});
        }
        const otp = String(Math.floor(((Math.random()*900000) + 100000)));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24*60*60*1000;
        await user.save();

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : 'Account Verification OTP',
            //text : `The OTP for your account verification is ${otp}`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOptions);
        
        res.json({success:true, message : "OTP SEND SUCCESSFULLY"});
    } catch (error) {
        res.json({success:false , message : error.message });
    }
}

export const verifyEmail = async (req,res) =>{
    const {userId,otp}=req.body;
    if(!userId || !otp){
        return res.json({success : true , message:"Missing details (otp or email)"});
    }

    try {
        const user  = await userModel.findById(userId);
        if(!user){
           return  res.json({success : false, message :"User not found"});
        }

        if(user.VerifyOtp==='' || user.verifyOtp!==otp){
            return res.json({success: false , message :"Invalid OTP"});
        }
        
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success : dalse , message: "OTP expired"});
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save()
        return res.json({success : true , message : "Email verified successfully"});

    } catch (error) {
        return res.json({success:true , message : error.message});
    }
}

//send password reset OTP

export const sendResetOtp = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:"false",message : "Email not found"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:"false",message : "user not found"});
        }

       const otp = String(Math.floor(((Math.random()*900000) + 100000)));

       user.resetOtp = otp;
       user.resetOtpExpireAt = Date.now() + 15*60*1000;

       await user.save();

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : 'Password Reset OTP',
            //text : `The OTP for reseting yout password is ${otp}`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({success :true , message:"OTP send successfully"});

    } catch (error) {
         return res.json({success:true , message : error.message});
    }
}

//Reset user password

export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json({success : false , message :"email , otp ,newpassword are required"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success : false ,message : "User not found"});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success:false,message :"Provide valid OTP"});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success : false ,message : "Reset OTP expirerd"});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success:true, message:"Password has been updated successfully"});
    } catch (error) {
        return res.json({success : false,message : error.message});
    }
}