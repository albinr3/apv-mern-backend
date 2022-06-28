import express from "express";
import { profile, editProfile, signUp, confirm, authenticateUser, forgetPassword, checkTokenPassword, newPassword, updatePassword} from "../controllers/veterinaryController.js";
import checkAuth from "../middleware/authMiddleware.js";

const veterinaryRouter = express.Router();

//public
veterinaryRouter.post("/", signUp);
veterinaryRouter.get("/confirm-account/:token", confirm);
veterinaryRouter.post("/login", authenticateUser);
veterinaryRouter.post("/forget-password", forgetPassword); //valid user email
veterinaryRouter.get("/forget-password/:token", checkTokenPassword); //check if the token is correct
veterinaryRouter.post("/forget-password/:token", newPassword); //change the user password


//private
veterinaryRouter.get("/profile", checkAuth ,profile);
veterinaryRouter.put("/profile/:id", checkAuth, editProfile);
veterinaryRouter.put("/new-password", checkAuth, updatePassword)

export default veterinaryRouter;