import UserModel from "../models/user.model.js";
import SvgModel from "../models/svg.model.js";

export async function saveSvg(request, response) {
    try {
        const userId = request.userId;
        const { svgCode, title, status } = request.body;

        if (!userId) {
            return response.status(401).json({
                message: "please login to save svg",
                success: false,
                error: true
            })
        }

        if (!svgCode || !title || !status) {
            return response.status(400).json({
                message: "svgCode, title, and status are required",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "user not found",
                error: true,
                success: false
            })
        }

        const payload = {
            userId: userId,
            svgCode: svgCode,
            title: title,
            status: status
        }
        const svg = await SvgModel.create(payload)

        return response.json({
            message: "your svg is saved successfully",
            error: false,
            success: true,
            data: svg
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getSvgs(request, response) {
    try {
        const search = request.query.search || '';
        
        const query = {
            title: { $regex: search, $options: 'i' },
            status: 'Public' 
        };

        const svgs = await SvgModel.find(query).populate('userId', 'name').sort({ createdAt: -1 });

        return response.json({
            message: "SVGs fetched successfully",
            data: svgs,
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

export async function getSvgsForUser(request, response) {
    try {
        const userId = request.userId;
        if (!userId) {
            return response.status(401).json({
                message: "Please login first",
                success: false,
                error: true
            });
        }
        const svgs = await SvgModel.find({ userId }).sort({ createdAt: -1 });
        return response.json({
            message: "User SVGs fetched successfully",
            data: svgs,
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

export async function getAllSvgsAdmin(request, response) {
    try {
        const svgs = await SvgModel.find().populate('userId', 'name email').sort({ createdAt: -1 });

        return response.json({
            message: "All SVGs fetched successfully",
            data: svgs,
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

export async function deleteSvg(request, response) {
    try {
        const { svgId } = request.body;

        if (!svgId) {
            return response.status(400).json({
                message: "SVG ID is required",
                error: true,
                success: false
            });
        }

        await SvgModel.findByIdAndDelete(svgId);

        return response.json({
            message: "SVG deleted successfully",
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
