import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export class UserController {
  static async getMe(req: Request, res: Response) {
    const { id } = req.user as any;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          GymSports: {
            include: {
              gym: true,
              sport: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          username: user.username,
          email: user.email,
          role: user.role,
          gyms: user.GymSports.map((gs) => gs.gym),
          sports: user.GymSports.map((gs) => gs.sport),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
}
