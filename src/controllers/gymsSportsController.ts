import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "@errors";

const prisma = new PrismaClient()

export class gymsSportsController {
    static async gymsSportCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, gymId, sportId } = req.body
            const gymsSport = await prisma.gymSports.create({ data: { userId, gymId, sportId } })
            res.status(201).send({
                success: true,
                message: "Created",
                data: gymsSport
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}