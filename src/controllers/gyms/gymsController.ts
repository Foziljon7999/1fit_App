import { Gym, PrismaClient } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { ErrorHandler } from "@errors"

const prisma = new PrismaClient()

export class GymsController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const geyms = await prisma.gym.findMany({
                include: {
                    GymSports: {
                        select: {
                            sport: true
                        }
                    }
                }   
            })
            res.status(200).json({
                success: true,
                data: geyms
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const gym = await prisma.gym.findUnique({
                where: { id: Number(id) },
                include: {
                    GymSports: {
                        select: {
                            sport: true
                        }
                    }
                }   
            })
            if (!gym) {
                res.status(404).send({
                    success: false,
                    message: "Gym not found!"
                })
            }
            res.status(200).send({
                success: true,
                data: gym
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user as any;
            const user = await prisma.user.findUnique({ where: { id } });
            if (user?.role === "admin") {
                const { name, location, branch } = req.body
                const gym = await prisma.gym.create({
                    data: { name, location, branch }
                })
                res.status(201).send({
                    success: true,
                    message: "Created Gym",
                    data: gym
                })
            } else {
                res.status(404).send({
                    success: false,
                    message: "Not found Admin",
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
                const { id }: Partial<Gym> = req.params
                let [gymCheck] = await prisma.gym.findMany({ where: { id: Number(id) } })
                if (gymCheck) {
                    const { branch, location, name }: Partial<Gym> = req.body
                    const updateGym = await prisma.gym.update({
                        where: { id: Number(id) },
                        data: { name, branch, location }
                    })
                    res.status(201).send({
                        success: true,
                        message: "Updated Gym",
                        data: updateGym
                    })
                } else {
                    res.status(201).send({
                        success: true,
                        message: "Not found Gym"
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
                const [gymsCheck] = await prisma.gym.findMany({where: {id: Number(id)}})
                if(gymsCheck){
                    await prisma.gym.delete({
                        where: { id: Number(id) }
                    })
                    res.status(201).send({
                        success: true,
                        message: "Deleted Gym",
                        
                    })
                } else {
                    res.status(201).send({
                        success: true,
                        message: "Not found Gym"
                    })
                }
                
            }
            
            res.status(201).send({
                success: true,
                message: "Deleted Gym"
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const { searchGym } = req.body
            const gyms = await prisma.gym.findMany({
                where: {
                    OR: [
                        { name: { contains: searchGym as string, mode: 'insensitive' } },
                        { location: { contains: searchGym as string, mode: 'insensitive' } },
                        { branch: { contains: searchGym as string, mode: 'insensitive' } }
                    ]
                },
                include: {
                    GymSports: {
                        select: {
                            sport: true
                        }
                    }
                }   
            })
            res.status(201).send({
                success: true,
                data: gyms
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}