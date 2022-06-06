import express from "express";
import { addPatients, deletePatient, editPatient, showPatient, showPatients } from "../controllers/patientController.js";
import checkAuth from "../middleware/authMiddleware.js";



const patientRouter = express.Router();

patientRouter.route("/").get(checkAuth, showPatients).post(checkAuth ,addPatients);

patientRouter.route("/:id").get(checkAuth, showPatient).put(checkAuth, editPatient).delete(checkAuth, deletePatient);











export default patientRouter;