import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { allowRoles } from "../middleware/allow-roles.js";

export function createAIRouter(ctrl) {
  const router = Router();

  router.post(
    "/grade/:submissionId",
    authenticate,
    allowRoles("teacher", "admin"),
    ctrl.gradeSubmission
  );

  return router;
}
