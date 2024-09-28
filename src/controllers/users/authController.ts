import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ErrorHandler } from "@errors"
import { PrismaClient } from "@prisma/client"
import { sign, verify } from "jsonwebtoken"

let client = new PrismaClient()

export class AuthController {
    static async LoginGithub(req: Request, res: Response, next: NextFunction) {
        try {
            passport.authenticate("github", {
                scope: [
                    "user:email"
                ]
            })(req, res)
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async CallbackGithub(req: Request, res: Response, next: NextFunction) {
        try {
            let { id, username, _json } = req.user as any
            let [checkUser] = await client.user.findMany({ where: { user_platform_id: id } })

            let access_token = sign({ id: checkUser.id }, "SECRET", { expiresIn: "10h" })
                let refresh_token = sign({ id: checkUser.id }, "SECRET")

            if (checkUser) {
                await client.user.update({
                    where: { id: checkUser.id },
                    data: {
                        access_token,
                        refresh_token,
                    },
                });
                res.status(200).send({
                    success: true,
                    message: "Successfully entered",
                    data: {
                        access_token,
                        refresh_token,
                        expiresIn: 60
                    }
                })
            } else {
                let user = await client.user.create({
                    data: {
                        user_platform_id: id,
                        username,
                        access_token,
                        refresh_token,
                        email: _json.email
                    }
                })

                res.status(200).send({
                    success: true,
                    message: "Successfully registered",
                    data: {
                        access_token,
                        refresh_token,
                        expiresIn: 60
                    }
                })
            }

        } catch (error: any) {
            next(new ErrorHandler(error.message, error.static))
        }
    }

    static async RefreshAccesToken(req: Request, res: Response, next: NextFunction) {
        try {
            let { refresh_token } = req.body

            if (!refresh_token) {
                return res.status(400).send({
                    success: false,
                    message: "Refresh token is required",
                });
            }

            let data: any ;
            try {
                data = verify(refresh_token, "SECRET")
            } catch (error) {
                return res.status(401).send({
                success: false,
                message: "Invalid refresh token",
            });
            }
            let checkUser = await client.user.findUnique({
                where: { id: data.id }
            })

            if (!checkUser) {
                res.status(404).send({
                    success: false,
                    message: "You don't exist"
                })
                return
            }
            let access_token = sign({ id: checkUser.id }, "SECRET", { expiresIn: "1h" })
            let new_refresh_token = sign({ id: checkUser.id }, "SECRET")


            res.status(200).send({
                success: true,
                message: "Token updated",
                data: {
                    access_token,
                    refresh_token: new_refresh_token,
                    expiresIn: "1h"
                }
            })

        } catch (error: any) {
            console.log(error);
            
            next(new ErrorHandler(error.message, error.status))
        }
    }
}