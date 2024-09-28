import { NextFunction, Request, Response } from "express";
import { PrismaClient, Sport } from "@prisma/client";
import { ErrorHandler } from "@errors";

const prisma = new PrismaClient()

export class SportsController{
    static async getAll(req: Request, res: Response, next: NextFunction){
        try {
            const sports = await prisma.sport.findMany({
                include: {
                    GymSports: {
                        select: {
                            gym: true
                        }
                    }
                }   
            })
            res.status(201).send({
                success: true,
                data: sports
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction){
        try {
        const { id } = req.params
        const sport = await prisma.sport.findUnique({
            where: { id: Number(id)},
            include: {
                GymSports: {
                    select: {
                        gym: true
                    }
                }
            }   
        })

        if(!sport){
            res.status(404).send({
                success: false,
                message: "Sport not found"
            })
        }
        res.json(sport)
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user as any
            const user = await prisma.user.findUnique({where: {id: Number(id)}})
            if(user?.role === "admin") {
                const { name } = req.body
                const sports = await prisma.sport.create({data: { name}})
            res.status(201).send({
                success: true,
                message: "Created Sport",
                data: sports
            })
        } else {
            res.status(201).send({
                success: false,
                message: "Not found Admin"
            })
        }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user as any
            const user = await prisma.user.findUnique({ where: { id } })
            if (user?.role === "admin") {
                const { id }: Partial<Sport> = req.params
                let [sportCheck] = await prisma.sport.findMany({ where: { id: Number(id) } })
                if (sportCheck) {
                    const { name }: Partial<Sport> = req.body
                    const updateGym = await prisma.sport.update({
                        where: { id: Number(id) },
                        data: { name }
                    })
                    res.status(201).send({
                        success: true,
                        message: "Updated sport",
                        data: updateGym
                    })
                } else {
                    res.status(201).send({
                        success: true,
                        message: "Not found Sport"
                    })
                }
            } else {
                res.status(201).send({
                    success: true,
                    message: "Not found Admin"
                })
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user as any
            const user = await prisma.user.findUnique({where: {id}})
            if(user?.role === "admin"){
                const { id } = req.params
                const [sportsCheck] = await prisma.sport.findMany({where: {id: Number(id)}})
                if(sportsCheck){
                    await prisma.sport.delete({
                        where: { id: Number(id) }
                    })
                    res.status(201).send({
                        success: true,
                        message: "Deleted Sport",
                        
                    })
                } else {
                    res.status(201).send({
                        success: true,
                        message: "Not found Sport"
                    })
                }
            }
            res.status(201).send({
                success: true,
                message: "Deleted Sport"
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const { searchSport } = req.body
            const sports = await prisma.sport.findMany({
                where: {
                    OR: [
                        { name: { contains: searchSport as string, mode: 'insensitive' } },
                    ]
                },
                include: {
                    GymSports: {
                        select: {
                            gym: true
                        }
                    }
                }   
            })
            res.status(201).send({
                success: true,
                data: sports
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}
