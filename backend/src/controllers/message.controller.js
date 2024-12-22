import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBars = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        
        // Get the most recent message between the logged-in user and others
        const messages = await Message.aggregate([
            { $match: { $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] } },
            { $group: { 
                _id: { $cond: [{ $eq: ["$senderId", loggedInUserId] }, "$receiverId", "$senderId"] },
                lastMessageDate: { $max: "$createdAt" }
            }},
            { $lookup: { 
                from: "users", 
                localField: "_id", 
                foreignField: "_id", 
                as: "user" 
            }},
            { $unwind: "$user" },
            { $project: { "user.password": 0 } }
        ]);

        // Sort users based on the most recent message date
        const sortedUsers = messages.sort((a, b) => b.lastMessageDate - a.lastMessageDate);

        res.status(200).json(sortedUsers.map(item => item.user));
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
};
export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId }=req.params;
        const myId = req.user._id;
        const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
        ]})
        res.status(200).json(messages);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
};

export const sendMessages = async (req, res) => {
    try {
        const {text,image} = req.body;
        const {id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        // real time message
        const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
};