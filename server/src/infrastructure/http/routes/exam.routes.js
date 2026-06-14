import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { allowRoles } from "../middleware/allow-roles.js";
import upload from "../../config/multer.js";

export function createExamRouter(ctrl) {
  const router = Router();

  router.use(authenticate, allowRoles("teacher", "admin"));

  router.post("/", upload.single("rubricFile"), ctrl.createExam);
  router.get("/", ctrl.listExams);
  router.get("/:id/analytics", ctrl.getExamAnalytics);
  router.get("/:id", ctrl.getExam);
  router.put("/:id", upload.single("rubricFile"), ctrl.updateExam);
  router.delete("/:id", ctrl.deleteExam);

  return router;
}
