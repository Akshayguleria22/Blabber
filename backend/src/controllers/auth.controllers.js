import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateToken } from '../lib/db.js';
import cloudinary from '../lib/cloudinary.js';



export const signUpController = async (req, res) => {
    const { firstname,lastname, email, password } = req.body
    try {
        if (password.length < 6) {
            return res.status(400).json( { message: "Password must be atleast 6 characters!!" } );
        }

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({message:"Email already exists"})
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
        })
        await newUser.save();
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            firstname: newUser.firstname,
            lastname:newUser.lastname,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.log("Error in signup controller",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}


export const logInController =async (req,res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isPasswordCorrect= await bcrypt.compare(password,user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Password" })
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            profilePic:user.profilePic,
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const logOutController =async (req,res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateprofile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id
        if (!profilePic) {
            return res.status(400).json({message:"Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");
        
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in update controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log('Error in checkauth controller', error.message)
        res.status(500).json({message:"Internal server error"})
    }
}
