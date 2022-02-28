import { Router } from "express";
import {
  forgotPasswordHandler,
  resetPasswordHandler,
  sendVerificationMail_loggedIn,
  verifyAccount,
} from "../controllers/auth.controller";
import { requireLogin } from "../middlewares/requireAuth";
import { validateResources } from "../middlewares/validateResources";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyAccountSchema,
} from "../schema/auth.schema";

const router = Router();

/* GET */
router.get(
  "/verify/:token",
  validateResources(verifyAccountSchema),
  verifyAccount
);

/* POST */
router.post(
  "/forgotPassword",
  validateResources(forgotPasswordSchema),
  forgotPasswordHandler
);
router.post(
  "/sendVerificationMail",
  requireLogin,
  sendVerificationMail_loggedIn
);

/* PATCH */
router.patch(
  "/resetPassword",
  validateResources(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
