import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBars = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        
        // Get all users except the logged-in user
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        // Get the most recent message between the logged-in user and others
        const messages = await Message.aggregate([
            { $match: { $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] } },
            { $group: { 
                _id: { $cond: [{ $eq: ["$senderId", loggedInUserId] }, "$receiverId", "$senderId"] },
                lastMessageDate: { $max: "$createdAt" }
            }}
        ]);

        // Map the messages to a user map for easy lookup
        const userMessagesMap = messages.reduce((acc, message) => {
            acc[message._id] = message.lastMessageDate;
            return acc;
        }, {});

        // Merge the users with their last message dates
        const usersWithMessages = users.map(user => {
            const lastMessageDate = userMessagesMap[user._id] || new Date(0);  // If no messages, assign an old date
            return { ...user.toObject(), lastMessageDate };  // Attach the last message date
        });

        // Sort users based on the most recent message date
        const sortedUsers = usersWithMessages.sort((a, b) => {
            // If both users have no message activity (i.e., both have new Date(0)), they should be ordered by their user ID
            if (a.lastMessageDate.getTime() === 0 && b.lastMessageDate.getTime() === 0) {
                return a.fullName.localeCompare(b.fullName); // Sort alphabetically for users without message activity
            }
            return b.lastMessageDate - a.lastMessageDate; // Sort users with messages first
        });

        res.status(200).json(sortedUsers);
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
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;

        // Upload the image to Cloudinary if an image is provided
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create a new message document
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        // Save the new message to the database
        await newMessage.save();

        // Emit the 'userUpdated' event to refresh both sender and receiver's sidebar
        if (connectedUsers[senderId]) {
            io.to(connectedUsers[senderId]).emit("userUpdated", { senderId, receiverId });
        }

        if (connectedUsers[receiverId]) {
            io.to(connectedUsers[receiverId]).emit("userUpdated", { senderId, receiverId });
        }
        // Emit the new message to the receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Emit the 'userUpdated' event to refresh both sender and receiver's sidebar
        


        // Send a response with the newly created message
        res.status(201).json(newMessage);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
};