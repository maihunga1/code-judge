import { Router } from "express";
import problemRoute from "./problems";
import authRoute from "./auth";

const routes = Router();

routes.use("/problem", problemRoute);
routes.use("/auth", authRoute);

export default routes;
