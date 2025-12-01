import { User } from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const uploadedUser = await User.create({
            email, password: hashedPass, name
        })
        // 1. Define the payload (user data/claims)
        const payload = {
            userId: uploadedUser._id,
            username: uploadedUser.name
        };

        // 2. Define your secret key (ideally from environment variables in production)
        const secretKey = process.env.JWT_SECRET

        // 3. Define options, such as expiration time
        const options = {
            expiresIn: "10d" // Token expires in 10 Days
        };
        const token = jwt.sign(payload, secretKey, options);

        uploadedUser.password = undefined;

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,   // ⭐ LOCALHOST ke liye ALWAYS false
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(201).json(
            {
                success: true,
                message: "User created successfully",
                uploadedUser,
                token
            });
    } catch (err) {
        console.log("error in signup");
        return res.status(500).json({ message: "Server error in signup" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ismatch = await bcrypt.compare(password, user.password);

        if (!ismatch) {
            return res.status(400).json({ message: "Password does not match" });
        }
        


        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            // token,
        })

    } catch (err) {
        console.log("error in login", err);
        return res.status(500).json({ message: "Server error" });
    }
}

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "log out successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })
    }
}