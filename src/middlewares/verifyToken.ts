import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied! No token provided."
        });
    }

    try {
        const verified = jwt.verify(token, "SECRET" as string);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

export { verifyToken }