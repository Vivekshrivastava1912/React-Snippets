import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken;
        if (!token) {
            // Find or create guest user
            let guest = await UserModel.findOne({ email: 'guest@reactsnippets.com' });
            if (!guest) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('guestpassword123', salt);
                guest = new UserModel({
                    name: 'Guest User',
                    email: 'guest@reactsnippets.com',
                    password: hashedPassword,
                    credit: 99999,
                    role: 'USER',
                    verify_email: true
                });
                await guest.save();
            } else if (guest.credit < 1000) {
                // Self-healing credit recharge for guest
                guest.credit = 99999;
                await guest.save();
            }
            request.userId = guest._id;
            return next();
        }

        let decode;
        try {
            decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        } catch (jwtError) {
            // Token is invalid or expired; fall back to guest user
            let guest = await UserModel.findOne({ email: 'guest@reactsnippets.com' });
            if (!guest) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('guestpassword123', salt);
                guest = new UserModel({
                    name: 'Guest User',
                    email: 'guest@reactsnippets.com',
                    password: hashedPassword,
                    credit: 99999,
                    role: 'USER',
                    verify_email: true
                });
                await guest.save();
            } else if (guest.credit < 1000) {
                guest.credit = 99999;
                await guest.save();
            }
            request.userId = guest._id;
            return next();
        }

        if (!decode || !decode.id) {
            // Decode failed; fall back to guest user
            let guest = await UserModel.findOne({ email: 'guest@reactsnippets.com' });
            if (!guest) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('guestpassword123', salt);
                guest = new UserModel({
                    name: 'Guest User',
                    email: 'guest@reactsnippets.com',
                    password: hashedPassword,
                    credit: 99999,
                    role: 'USER',
                    verify_email: true
                });
                await guest.save();
            } else if (guest.credit < 1000) {
                guest.credit = 99999;
                await guest.save();
            }
            request.userId = guest._id;
            return next();
        }

        request.userId = decode.id;
        next();
    } catch (error) {
        // Log error and fallback to guest user
        console.error("Auth middleware error:", error);
        try {
            let guest = await UserModel.findOne({ email: 'guest@reactsnippets.com' });
            if (!guest) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('guestpassword123', salt);
                guest = new UserModel({
                    name: 'Guest User',
                    email: 'guest@reactsnippets.com',
                    password: hashedPassword,
                    credit: 99999,
                    role: 'USER',
                    verify_email: true
                });
                await guest.save();
            }
            request.userId = guest._id;
            return next();
        } catch (fallbackError) {
            return response.status(500).json({
                message: error.message || error,
                error: true,
                success: false
            });
        }
    }
};

export default auth;
