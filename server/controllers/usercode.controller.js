import UserModel from "../models/user.model.js";
import UserCodeModel from "../models/userCode.model.js";

export async function saveUserCode(request, response) {

    try {
        const userId = request.userId;
        const { code, title ,status } = request.body;

        if (!userId) {
            return response.status(401).json({
                message: "please login to save code",
                success: false,
                error: true
            })
        }

        if (!code || !title|| !status) {
            return response.status(400).json({
                message: "code, title, and status are required",
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
            title: title,
            status: status
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

export async function getUserCodes(request, response) {
    try {
        const search = request.query.search || '';
        
        // Find public components that match the search query
        const query = {
            title: { $regex: search, $options: 'i' },
            status: 'Public' 
        };

        const codes = await UserCodeModel.find(query).populate('userId', 'name').sort({ createdAt: -1 });

        return response.json({
            message: "Codes fetched successfully",
            data: codes,
            success: true,
            error: false
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
} 

export async function getCodesForUser(request, response) {
    try {
        const userId = request.userId;
        if (!userId) {
            return response.status(401).json({
                message: "Please login first",
                success: false,
                error: true
            });
        }
        const codes = await UserCodeModel.find({ userId }).sort({ createdAt: -1 });
        return response.json({
            message: "User codes fetched successfully",
            data: codes,
            success: true,
            error: false
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//---------------------------------------------------------Admin: Get All Components---------------------------------------------------------//
export async function getAllComponentsAdmin(request, response) {
    try {
        const codes = await UserCodeModel.find().populate('userId', 'name email').sort({ createdAt: -1 });

        
        return response.json({
            message: "All components fetched successfully",
            data: codes,
            success: true,
            error: false
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//---------------------------------------------------------Delete Component---------------------------------------------------------//
export async function deleteComponent(request, response) {
    try {
        const { componentId } = request.body;

        if (!componentId) {
            return response.status(400).json({
                message: "Component ID is required",
                error: true,
                success: false
            });
        }

        await UserCodeModel.findByIdAndDelete(componentId);

        return response.json({
            message: "Component deleted successfully",
            success: true,
            error: false
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}