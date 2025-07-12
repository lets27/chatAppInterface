import mongoose from "mongoose";
import Message from "../database/Models/MessageModel.js";
import User from "../database/Models/userModel.js";
import cloudinary from "cloudinary";
import multer from "multer";
import { getRecieverSocketId, io } from "../socket/socket.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const APIKEY = process.env.APIKEY;
const foldername = process.env.foldername;
const cloudname = process.env.cloudname;
const APISECRET = process.env.APISECRET;

cloudinary.config({
  cloud_name: cloudname,
  api_key: APIKEY,
  api_secret: APISECRET,
});

const allUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    if (!currentUserId) {
      return res.status.json("unauthorized access");
    }
    // Fetch all users except the current user
    const filteredUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");
    return res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const currentUserId = req.user.id;
    if (!currentUserId) {
      return res.status(404).json("unauthorized access");
    }
    // get all messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: currentUserId },
      ],
    });

    console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(403).json({ error: "Please login" });
    }

    const findReceiver = await User.findById(id);
    if (!findReceiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    let imageUrl = null;

    if (req.file) {
      const fileType = req.file.mimetype;
      if (!["image/jpeg", "image/png"].includes(fileType)) {
        return res.status(400).json({ error: "Invalid file type." });
      }

      console.log("file", req.file);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: foldername },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }
    console.log("recieverId", id);
    const newMessage = {
      senderId: currentUserId,
      recieverId: id,
      text: req.body.message,
      image: imageUrl, // imageUrl will be null if no file uploaded
    };

    const messageSend = await Message.create(newMessage);
    console.log("messageSend", messageSend);

    const senderSocketId = getRecieverSocketId(newMessage.senderId);
    const receiverSocketId = getRecieverSocketId(newMessage.recieverId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("latestMessage", newMessage);
    }

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("latestMessage", newMessage);
    }

    return res.status(201).json({ message: messageSend });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getMessages, allUsers, sendMessages, upload };
