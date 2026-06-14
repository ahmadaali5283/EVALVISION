import { MongoUserRepository } from "../persistence/mongoose/repositories/MongoUserRepository.js";
import { MongoExamRepository } from "../persistence/mongoose/repositories/MongoExamRepository.js";
import { MongoSubmissionRepository } from "../persistence/mongoose/repositories/MongoSubmissionRepository.js";
import { MongoEvaluationRepository } from "../persistence/mongoose/repositories/MongoEvaluationRepository.js";
import { JwtTokenService } from "../services/JwtTokenService.js";
import { AIGradingService } from "../services/AIGradingService.js";
import { LocalFileStorageService } from "../services/LocalFileStorageService.js";
import { RegisterUserUseCase } from "../../application/use-cases/auth/RegisterUserUseCase.js";
import { LoginUserUseCase } from "../../application/use-cases/auth/LoginUserUseCase.js";
import { GetMeUseCase } from "../../application/use-cases/auth/GetMeUseCase.js";
import { CreateExamUseCase } from "../../application/use-cases/exam/CreateExamUseCase.js";
import { ListExamsUseCase } from "../../application/use-cases/exam/ListExamsUseCase.js";
import { GetExamUseCase } from "../../application/use-cases/exam/GetExamUseCase.js";
import { UpdateExamUseCase } from "../../application/use-cases/exam/UpdateExamUseCase.js";
import { DeleteExamUseCase } from "../../application/use-cases/exam/DeleteExamUseCase.js";
import { GetExamAnalyticsUseCase } from "../../application/use-cases/exam/GetExamAnalyticsUseCase.js";
import { CreateSubmissionUseCase } from "../../application/use-cases/submission/CreateSubmissionUseCase.js";
import { ListSubmissionsByExamUseCase } from "../../application/use-cases/submission/ListSubmissionsByExamUseCase.js";
import { GetSubmissionUseCase } from "../../application/use-cases/submission/GetSubmissionUseCase.js";
import { UploadSubmissionUseCase } from "../../application/use-cases/submission/UploadSubmissionUseCase.js";
import { CheckPlagiarismUseCase } from "../../application/use-cases/submission/CheckPlagiarismUseCase.js";
import { GetEvaluationBySubmissionUseCase } from "../../application/use-cases/evaluation/GetEvaluationBySubmissionUseCase.js";
import { GetEvaluationsByExamUseCase } from "../../application/use-cases/evaluation/GetEvaluationsByExamUseCase.js";
import { UpdateEvaluationUseCase } from "../../application/use-cases/evaluation/UpdateEvaluationUseCase.js";
import { GradeSubmissionUseCase } from "../../application/use-cases/ai/GradeSubmissionUseCase.js";
import { AuthHttpController } from "../http/controllers/auth.http.js";
import { ExamHttpController } from "../http/controllers/exam.http.js";
import { SubmissionHttpController } from "../http/controllers/submission.http.js";
import { SubmissionUploadHttpController } from "../http/controllers/submission-upload.http.js";
import { EvaluationHttpController } from "../http/controllers/evaluation.http.js";
import { AIHttpController } from "../http/controllers/ai.http.js";
import { createAuthRouter } from "../http/routes/auth.routes.js";
import { createExamRouter } from "../http/routes/exam.routes.js";
import { createSubmissionRouter } from "../http/routes/submission.routes.js";
import { createSubmissionUploadRouter } from "../http/routes/submission-upload.routes.js";
import { createAIRouter } from "../http/routes/ai.routes.js";
import { createEvaluationRouter } from "../http/routes/evaluation.routes.js";
import { createExpressApp } from "../http/app.js";

export function initContainer() {
  const userRepo = new MongoUserRepository();
  const examRepo = new MongoExamRepository();
  const submissionRepo = new MongoSubmissionRepository();
  const evaluationRepo = new MongoEvaluationRepository();

  const tokenService = new JwtTokenService();
  const aiGradingService = new AIGradingService();
  const fileStorageService = new LocalFileStorageService();

  const registerUseCase = new RegisterUserUseCase(userRepo, tokenService);
  const loginUseCase = new LoginUserUseCase(userRepo, tokenService);
  const getMeUseCase = new GetMeUseCase(userRepo);

  const createExamUseCase = new CreateExamUseCase(examRepo, userRepo, fileStorageService);
  const listExamsUseCase = new ListExamsUseCase(examRepo, userRepo);
  const getExamUseCase = new GetExamUseCase(examRepo);
  const updateExamUseCase = new UpdateExamUseCase(examRepo, fileStorageService);
  const deleteExamUseCase = new DeleteExamUseCase(examRepo);
  const getExamAnalyticsUseCase = new GetExamAnalyticsUseCase(examRepo, submissionRepo, evaluationRepo);

  const createSubmissionUseCase = new CreateSubmissionUseCase(submissionRepo, examRepo, userRepo);
  const listSubmissionsUseCase = new ListSubmissionsByExamUseCase(submissionRepo, examRepo);
  const getSubmissionUseCase = new GetSubmissionUseCase(submissionRepo);
  const uploadSubmissionUseCase = new UploadSubmissionUseCase(submissionRepo, examRepo, userRepo, fileStorageService);
  const checkPlagiarismUseCase = new CheckPlagiarismUseCase(submissionRepo, examRepo, evaluationRepo);

  const getEvalBySubUseCase = new GetEvaluationBySubmissionUseCase(evaluationRepo, submissionRepo);
  const getEvalsByExamUseCase = new GetEvaluationsByExamUseCase(evaluationRepo);
  const updateEvalUseCase = new UpdateEvaluationUseCase(evaluationRepo, submissionRepo);

  const gradeSubmissionUseCase = new GradeSubmissionUseCase(submissionRepo, examRepo, evaluationRepo, aiGradingService);

  const authCtrl = new AuthHttpController(registerUseCase, loginUseCase, getMeUseCase);
  const examCtrl = new ExamHttpController(
    createExamUseCase,
    listExamsUseCase,
    getExamUseCase,
    updateExamUseCase,
    deleteExamUseCase,
    getExamAnalyticsUseCase
  );
  const subCtrl = new SubmissionHttpController(
    createSubmissionUseCase,
    listSubmissionsUseCase,
    getSubmissionUseCase,
    checkPlagiarismUseCase
  );
  const subUploadCtrl = new SubmissionUploadHttpController(uploadSubmissionUseCase);
  const evalCtrl = new EvaluationHttpController(getEvalBySubUseCase, getEvalsByExamUseCase, updateEvalUseCase);
  const aiCtrl = new AIHttpController(gradeSubmissionUseCase);

  const authRouter = createAuthRouter(authCtrl);
  const examRouter = createExamRouter(examCtrl);
  const submissionRouter = createSubmissionRouter(subCtrl);
  const submissionUploadRouter = createSubmissionUploadRouter(subUploadCtrl);
  const aiRouter = createAIRouter(aiCtrl);
  const evaluationRouter = createEvaluationRouter(evalCtrl);

  return createExpressApp({
    authRouter,
    examRouter,
    submissionRouter,
    submissionUploadRouter,
    aiRouter,
    evaluationRouter,
  });
}
