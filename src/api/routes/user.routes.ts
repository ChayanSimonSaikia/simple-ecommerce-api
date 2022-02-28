import { Router } from "express";
import { changeEmailUserHandler, changePasswordUserHandler, createUserHandler, logInUserHandler } from "../controllers/user.controller";
import { validateResources } from "../middlewares/validateResources";
import { changeEmailSchema, changePasswordSchema, createUserSchema, logInUserSchema } from "../schema/user.schema";
const router = Router();

/* POST */
router.post(
  "/register",
  validateResources(createUserSchema),
  createUserHandler
);
router.patch(
  "/changeEmal",
  validateResources(changeEmailSchema),
  changeEmailUserHandler
);
router.patch(
  "/changePassword",
  validateResources(changePasswordSchema),
  changePasswordUserHandler
);

router.post(
  "/login",
  validateResources(logInUserSchema),
  logInUserHandler
);

export default router;
