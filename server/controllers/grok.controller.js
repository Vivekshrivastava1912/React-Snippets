import { getGroqChatCompletion } from '../config/grok.js';

export async function grokChat(request, response) {

    try{
        const{prompt} = request.body;
        if(!prompt){
            return response.status(400).json({
                message : "prompt is required"
            })
        }

        const grokResponse = await getGroqChatCompletion(prompt);
        const llmResponse = grokResponse.choices[0]?.message?.content || "";

        return response.status(200).json({
            success : true,
            message : llmResponse
        })
    }
    catch(error){
        return response.status(500).json({
            message : "Internal server error"
        })
    }
}