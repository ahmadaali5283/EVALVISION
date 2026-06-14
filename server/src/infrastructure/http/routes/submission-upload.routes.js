import { Router } from "express";
import upload from "../../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";
import { allowRoles } from "../middleware/allow-roles.js";

export function createSubmissionUploadRouter(ctrl) {
  const router = Router();

  router.post(
    "/upload/:examId",
    authenticate,
    allowRoles("teacher", "admin"),
    upload.single("file"),
    ctrl.uploadSubmission
  );

  return router;
}
