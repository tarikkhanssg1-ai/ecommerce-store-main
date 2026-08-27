import jwt from "jsonwebtoken";
import User from "../models/userModel.js"

export const isAuthenticatedUser = async (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({message: "No token found"});
    }
    try{
        const decoded_data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded_data.id)
        next()
    } catch (error) {
        return res.status(401).json({
            success : false,
            message : "Plz Login First"
        })
    }
}

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user?.role}) is not allowed to access this resource`,
            });
        }
        next();
    };
}