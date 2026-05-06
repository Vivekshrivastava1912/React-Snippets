import { getSvgGroqChatCompletion } from "../config/svggrok.js";
import UserModel from "../models/user.model.js";

export async function svgGrokChat(request, response) {

    try {
        const { prompt } = request.body;
        const userId = request.userId;


        if (!prompt) {
            return response.status(400).json({
                message: "Prompt is required"
            });
        }

        const user = await UserModel.findById(userId);
        if (!user || user.credit < 20) {
            return response.status(400).json({
                message: "You have insufficient credit"
            });
        }

        const svgGrokResponse = await getSvgGroqChatCompletion(prompt);
        const llmResponse = svgGrokResponse.choices[0]?.message?.content || "";

        user.credit -= 20;
        await user.save();


        return response.status(200).json({
            success: true,
            message: llmResponse,
            updatedCredits: user.credit
        });


    }

    catch (error) {

        console.error("AI Generation Error:", error);
        return response.status(500).json({
            message: "Internal server error"
        });

    }


}