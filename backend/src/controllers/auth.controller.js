import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup= async (req,res)=>{
   const {fullName, email, password,profilePic} = req.body;
    try{
        //hash password
        if(!fullName || !email || !password){
            return res.status(400).json({
                error:"All fields are required"
            });
        }
        if (password.length<6){
            return res.status(400).json({
                error:"Password should be at least 6 characters long"
            });
        }
        const user = await User.findOne({ email })
        if(user){
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic,
        })
        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
               });
        }
        else{
            res.status(400).json({message:" Invalid user data"});
        }    
    }catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({message:error.message});
    }
};

export const login=async (req,res)=>{
    const {email,password} = req.body
    try{
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
           });
    }
    catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({message:error.message});
    }
};

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logout successful"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:error.message});
    }
};

export const updateProfile=async (req,res)=>{
try {
    const {profilePic} = req.body;
    const userId = req.user._id;
    if(!profilePic){
        return res.status(400).json({message:"Profile picture is required"});
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});
    res.status(200).json(updatedUser);
} catch (error) {
    console.log(error.message);
    res.status(500).json({message:error.message});
}
};

export const checkAuth = async (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
};