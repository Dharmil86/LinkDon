import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Profile from "../models/profiles.model.js";
import Comments from "../models/comments.model.js"
import ConnectionRequest from "../models/connections.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";


const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputpath =  crypto.randomBytes(16).toString('hex') + '.pdf';
    const stream = fs.createWriteStream("uploads/" + outputpath);

    doc.pipe(stream);
    doc.image(userData.userId.profilePicture, { align: 'center', width: 100 });
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);
    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
    });

    doc.end();

    return outputpath;
}

export const register = async (req, res) => {

    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const profile = new Profile({userId: newUser._id});

        await profile.save();

        return res.json({message: "User registered"});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = crypto.randomBytes(32).toString('hex');
        await User.updateOne({ _id: user._id }, { token });

        return res.json({ token: token});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const uploadProfilePicture = async (req, res) => {
    const {token} = req.body;

    try {
        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "user not found" });

       user.profilePicture = `uploads/${req.file.filename}`;

        await user.save();

        return res.json({message: "Profile picture updated"}); 

        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

import jwt from "jsonwebtoken";


export const updateUserProfile = async (req, res) => {

    try {
        const {token, ...newUserData } = req.body;

        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "user not found" });

        const {username, email} = newUserData;
         const existingUser = await User.findOne({ $or: [ { username }, { email } ]});

        if (existingUser) {
            if (existingUser || String(existingUser._id) !== String(user._id)) {
                return res.status(400).json({ message: "User already exists" });
            }
        }

        Object.assign(user, newUserData);

        await user.save();

        return res.json({message: "Profile updated"});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}







export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "user not found" });

        console.log(user)

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId',"name username email profilePicture");

        return res.json(userProfile);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;
        const userProfile = await User.findOne({ token: token });

        if (!userProfile) return res.status(404).json({ message: "user not found" });
         const profile_to_update = await Profile.findOne({ userId: userProfile._id });

         Object.assign(profile_to_update, newProfileData);

         await profile_to_update.save();

        return res.json({message: "Profile data updated"});

        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('userId', "name username email profilePicture");
        return res.json(profiles);
    }   catch (error) { 
        return res.status(500).json({message: error.message});
    }
}

export const downloadProfile = async (req, res) => {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id })
        .populate('userId',"name username email profilePicture");

    let outputpath = await convertUserDataToPDF(userProfile);

    return res.json({ "message": outputpath });
}



export const sendConnectionRequest = async (req, res) => {
    
    const { token, connectionId } = req.body;

    try {
        
        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "user not found" });

        const connectionUser = await User.findOne({ _id: connectionId });
        if (!connectionUser) return res.status(404).json({ message: "Connection user not found" });

        const existingRequest = await ConnectionRequest.findOne({ userId: user._id, connectionId: connectionUser._id });
        if (existingRequest) return res.status(400).json({ message: "Connection request already sent" });

        const request = new ConnectionRequest({ userId: user._id, connectionId: connectionUser._id });

        await request.save();

        return res.json({ message: "Connection request sent" });


    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}


export const getMyConnectionsRequests = async (req, res) => {

    const { token } = req.query;

    try {
        
        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "user not found" });

        const connections = await ConnectionRequest.find({ userId: user._id })
            .populate('connectionId', "name username email profilePicture");

        return res.status(200).json(connections);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const whatAreMyConnections = async (req, res) => {

    const { token } = req.query;

    try {
        
        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "user not found" });

        const connections = await ConnectionRequest.find({ connectionId: user._id })
            .populate('userId', "name username email profilePicture");

            return res.status(200).json(connections);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;

    try {
        
        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "user not found" });

        const connection = await ConnectionRequest.findOne({ _id: requestId, connectionId: user._id });

        if (!connection) return res.status(404).json({ message: "Connection request not found" });

        if (action_type === 'accept') {
            connection.status = true;
        } else {
            connection.status = false;
        }

        await connection.save();

        return res.json({ message: "Connection request updated" });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}



export const commentPost = async (req, res) => {

    const { post_id, token, commentBody } = req.body;

    try {
        
        const user = await User.findOne({ token: token }).select('_id');

        if (!user) return res.status(404).json({ message: "user not found" });  

        const post = await Post.findOne({ _id: post_id});

        if (!post) return res.status(404).json({ message: "post not found" });

        const comment = new Comments({
            userId: user._id,
            postId: post_id, 
            body: commentBody
        });

        await comment.save();

        return res.status(200).json({ message: "Comment added" });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}


export const getUserProfileAndUserBasedOnUsername =  async (req,res) => {

    const {username} = req.query;

    try {
        const user = await User.findOne({
            username
        });

        if (!user) {
            return res.status(404).json({message: "User not Found"})
        }

        const userProfile = await Profile.findOne({userId: user._id})
        .populate("userId", "name username email profilePicture");

        return res.json({"profile": userProfile})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}