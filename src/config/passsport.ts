import passport from "passport"
import { Strategy as GithubStrategy } from "passport-github2"
import dotenv from "dotenv"
dotenv.config()
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

passport.use(new GithubStrategy ({
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: process.env.GITHUB_REDIRECT_URI as string,
    scope: ['user: email']
}, (acces_token: string, refresh_token: string | undefined, profile: any, done: any) => {
    done(null, profile)
    
}))

passport.serializeUser((user: any, done) => {
    done(null, user.id)
})

passport.deserializeUser((user: any, done) => {
    done(null, user)
})