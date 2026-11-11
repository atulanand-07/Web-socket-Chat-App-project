import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async(req, res) => {
    try {
        const LoggedInUserId = req.user._id;
        const fillteredUsers = await User.find({_id: { $ne: LoggedInUserId } }).select("-password");

        res.status(200).json({error: "Internal Server Error."});

    } catch (error) {
        console.error("Error in getUserForSidebar: ", error.message);
        res.status(500).json({ error:"Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Messages.find({
            $or : [
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
    } catch (error) {
        console.error("Error in getMessages: ", error.message);
        res.status(500).json({ error:"Internal Server Error" });        
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {test, image} = req.body;
        const {id:receiverId} = req.params;

        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId, 
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save();

        // TODO: IMPLEMENT SOCKET IO TO SEND MESSAGES TO RECEIVER FOR REAL-TIME CHAT

        res.status(200).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({ error:"Internal Server Error" });
    }
}