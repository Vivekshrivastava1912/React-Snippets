import { getGroqChatCompletion } from '../config/grok.js';
import UserModel from '../models/user.model.js';

export async function grokChat(request, response) {
    try {
        const { prompt } = request.body;
        const userId = request.userId;

        if (!prompt) {
            return response.status(400).json({
                message: "prompt is required"
            });
        }

        const user = await UserModel.findById(userId);
        if (!user || user.credit < 20) {
            return response.status(400).json({
                success: false,
                message: "you have not sufficient credit..."
            });
        }

        const grokResponse = await getGroqChatCompletion(prompt);
        const llmResponse = grokResponse.choices[0]?.message?.content || "";

        // Deduct 20 credits
        user.credit -= 20;
        await user.save();

        return response.status(200).json({
            success: true,
            message: llmResponse,
            updatedCredits: user.credit
        });
    }
    catch (error) {
        console.error("AI Generation Error in grok:", error);
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}
