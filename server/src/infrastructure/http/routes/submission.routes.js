import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { allowRoles } from "../middleware/allow-roles.js";

export function createSubmissionRouter(ctrl) {
  const router = Router();

  router.use(authenticate, allowRoles("teacher", "admin"));

  router.post("/", ctrl.createSubmission);
  router.get("/exam/:examId/plagiarism", ctrl.checkPlagiarism);
  router.get("/exam/:examId", ctrl.listSubmissionsByExam);
  router.get("/:id", ctrl.getSubmission);

  return router;
}
