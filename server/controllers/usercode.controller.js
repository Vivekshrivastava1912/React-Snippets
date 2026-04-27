import UserModel from "../models/user.model.js";
import UserCodeModel from "../models/userCode.model.js";

export async function saveUserCode(request, response) {

    try {
        const userId = request.userId;
        const { code, title } = request.body;

        if (!userId) {
            return response.status(401).json({
                message: "please login to save code",
                success: false,
                error: true
            })
        }

        if (!code || !title) {
            return response.status(400).json({
                message: "code and title are required",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "first create an account",
                error: true,
                success: false
            })
        }

        const payload = {
            userId: userId,
            code: code,
            title: title
        }
        const usercode = await UserCodeModel.create(payload)

        return response.json({
            message: "your code is saved successfully",
            error: false,
            success: true,
            data: usercode
        })


    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false

        });

    }


} 