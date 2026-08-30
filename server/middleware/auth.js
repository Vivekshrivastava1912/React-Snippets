import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];
        
        if (!token) {
            return response.status(401).json({
                message: "Authentication required. Please login to continue.",
                error: true,
                success: false
            });
        }

        let decode;
        try {
            decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        } catch (jwtError) {
            return response.status(401).json({
                message: "Session expired or invalid token. Please login again.",
                error: true,
                success: false
            });
        }

        if (!decode || !decode.id) {
            return response.status(401).json({
                message: "Invalid access token",
                error: true,
                success: false
            });
        }

        request.userId = decode.id;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export default auth;

