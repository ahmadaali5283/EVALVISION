import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { allowRoles } from "../middleware/allow-roles.js";

export function createEvaluationRouter(ctrl) {
  const router = Router();

  router.use(authenticate, allowRoles("teacher", "admin"));

  router.get("/:submissionId", ctrl.getEvaluationBySubmission);
  router.put("/:submissionId", ctrl.updateEvaluation);
  router.get("/exam/:examId", ctrl.getEvaluationsByExam);

  return router;
}
