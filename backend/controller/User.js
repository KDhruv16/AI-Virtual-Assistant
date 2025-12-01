import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";

import { User } from "../model/User.js";
import moment from "moment-timezone";


export const getCurrentUser = async (req, res) => {
    console.log("inside getuser");
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json({ message: "get current user error" });
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body
        let assistantImage;
        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path)
        } else {
            assistantImage = imageUrl
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            assistantName, assistantImage
        }, { new: true }).select("-password")
        return res.status(200).json(user)


    } catch (error) {
        return res.status(400).json({ message: "updateAssistantError user error" })
    }
}

export const askToAssistant = async (req, res) => {
    try {
        let { command } = req.body;
        let user = await User.findById(req.userId);
        let username = user.name;
        let assistantName = user.assistantName;
        user.history.push(command)
      user.save()
        //  let assistantImage = user.assistantImage;

        let result = await geminiResponse(command, assistantName, username);
        const jsonMatch = result.match(/{[\s\S]*}/)
        if (!jsonMatch) {
            return res.ststus(400).json({ response: "sorry, i can't understand" })
        }
        const gemResult = JSON.parse(jsonMatch[0])
        console.log(gemResult)
        const type = gemResult.type
        switch (type) {
            case 'get-date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get-time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current time is ${moment().tz("Asia/Kolkata").format("hh:mm A")}`
                });

            case 'get-day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("dddd")}`
                });
            case 'get-month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("MMMM")}`
                });
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'general':
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                });

            default:
                return res.status(400).json({ response: "I didn't understand that command." })
        }

    } catch (error) {
        return res.status(400).json({ message: "askToAssistantError user error" })
    }
}