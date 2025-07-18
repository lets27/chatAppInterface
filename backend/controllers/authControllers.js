import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { decode } from "jsonwebtoken";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import cloudinary from "cloudinary";
import User from "../database/Models/userModel.js";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();
const secretKey = process.env.JWTSECRET;
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

const signUp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password || !req.file) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error: "Please provide email, username, password, and image.",
      });
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // File validation
    if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Invalid file type." });
    }

    // Cloudinary upload
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: foldername },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    const newUser = await User.create(
      [
        {
          email,
          username,
          password: hashedPassword,
          profilePicture: uploadResult.secure_url,
          filename: uploadResult.public_id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "User created successfully",
      user: newUser[0], // Since we used array syntax
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Signup Error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;

  const userObject = await User.findOne({ email });
  // console.log("user:", userObject);

  if (!userObject) {
    const error = new Error();
    error.message = "no Account with this email";
    error.status = 404;
    throw error;
  }

  const formData = {
    email: email,
    password: password,
  };

  //check passwords match
  const isPasswordMatch = await bcrypt.compare(
    formData.password,
    userObject.password
  );

  if (!isPasswordMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const tokenPayload = {
    id: userObject._id,
    username: userObject.username,
    profilePic: userObject.profilePic,
    filename: userObject.filename,
  };

  sign(tokenPayload, secretKey, (err, token) => {
    if (err) return res.status(500).json("failed to generate token");

    const decoded = decode(token); // decode manually

    if (!decoded || !decoded.id) {
      return res.status(500).json({ error: "Failed to decode token" });
    }
    return res.status(200).json({ token, user: userObject });
  });
};

const singleUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    console.log("Authenticated user ID:", userId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - no user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Found user:", user);
    return res.status(200).json({ user });
  } catch (error) {
    console.error("singleUser error:", error);
    next(error);
  }
};

export { signUp, singleUser, login, upload };
