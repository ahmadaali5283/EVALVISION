import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

export function createAuthRouter(ctrl) {
  const router = Router();

  router.post("/register", ctrl.register);
  router.post("/login", ctrl.login);
  router.get("/me", authenticate, ctrl.getMe);

  return router;
}
