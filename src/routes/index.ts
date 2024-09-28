import { GymsController } from "@controllers/gyms";
import { gymsSportsController } from "@controllers/gymsSportsController";
import { SportsController } from "@controllers/sports";
import { AdminController, AuthController } from "@controllers/users";
import { UserController } from "@controllers/users/userController";
import { verifyToken } from "@middlewares";
import { Role } from "@prisma/client";
import { Router } from "express";
import passport from "passport";

let router: Router = Router();

// Users
router.get("/github/login", AuthController.LoginGithub);
router.get('/github/callback', passport.authenticate("github"), AuthController.CallbackGithub);
router.post("/github/refresh-token", AuthController.RefreshAccesToken);
router.get("/users/get-me", verifyToken, UserController.getMe);
router.post("/create/admin", AdminController.createStaticAdmin);
router.get("/admin/get-by/:id", AdminController.getStaticAdmin);
router.get("/admin/get-all", AdminController.getAll);

// Gyms
router.get("/gyms/get/all", GymsController.getAll);
router.get("/gyms/get/byId/:id", GymsController.getById);
router.post("/gyms/create", verifyToken, GymsController.create);
router.patch("/gyms/update/:id", verifyToken, GymsController.update); 
router.delete("/gyms/delete/:id", verifyToken, GymsController.delete); 
router.get("/gyms/search", GymsController.search);

// Sports
router.get("/sports/get-all", SportsController.getAll)
router.get("/sports/get-byId/:id", SportsController.getById)
router.post("/sports/create", verifyToken, SportsController.create)
router.patch("/sports/update/:id", verifyToken, SportsController.update)
router.delete("/sports/delete/:id", verifyToken, SportsController.delete)
router.get("/sports/search", SportsController.search)


// GymsSport
router.post("/gymsSport/create", gymsSportsController.gymsSportCreate)

export default router;
