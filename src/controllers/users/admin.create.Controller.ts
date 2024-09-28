import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; 

const prisma = new PrismaClient();

export class AdminController{
    static async createStaticAdmin(req: Request, res: Response, next: NextFunction) {
        try {
          const { user_platform_id, username, email, role } = req.body
          const adminUser = await prisma.user.create({
            data: {
              user_platform_id,
              username,
              email,
              role 
            },
          });
          
          const token = jwt.sign({ id: adminUser.id, role: adminUser.role }, "SECRET", {
            expiresIn: "1h", 
          });
          res.status(200).send({
            success: true,
            message: "Created admin",
            token: token
          })
          return { ...adminUser, token }; 
        } catch (error) {
          console.error("Error creating admin:", error);
        } finally {
          await prisma.$disconnect();
        }
      }

      static async getStaticAdmin(req: Request, res: Response){
       try {
        const { id } = req.params
        const adminUser = await prisma.user.findUnique({
            where: {id: Number(id)}
        })
        if(!adminUser){
            throw new Error("Admin is not found")
        }
        const token = jwt.sign({id: adminUser.id, role: adminUser.role}, "SECRET", { expiresIn: "1h"})
        res.status(200).send({
            success: true,
            message: "Admin found",
            data: {
                id: adminUser.id,
                username: adminUser.username,
                email: adminUser.email,
                role: adminUser.role,
                token,
            }
        })
       } catch (error) {
        console.error("Error creating admin:", error);
       } finally {
        await prisma.$disconnect()
       }
      }

      static async getAll(req: Request, res: Response){
        try {
         const adminUser = await prisma.user.findMany({ })
         
         
         res.status(200).send({
             success: true,
             message: "Admin found",
             data: adminUser
         })
        } catch (error) {
         console.error("Error creating admin:", error);
        } finally {
         await prisma.$disconnect()
        }
       }
 } 
