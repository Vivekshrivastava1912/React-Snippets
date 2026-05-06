import UserModel from "../models/user.model.js";

const admin = async (request, response, next) => {
    try {
        const userId = request.userId;

        const user = await UserModel.findById(userId);

        if (user.role !== 'ADMIN' && user.role !== 'admin') {
            return response.status(403).json({
                message: "Permission denied. Admin access only.",
                error: true,
                success: false
            });
        }

        next();
    } catch (error) {
        return response.status(500).json({
            message: "Internal server error in admin middleware",
            error: true,
            success: false
        });
    }
};

export default admin;
