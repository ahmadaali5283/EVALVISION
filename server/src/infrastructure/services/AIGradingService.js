import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import FormData from "form-data";
import { IAIGradingService } from "../../application/ports/services/IAIGradingService.js";
import { env } from "../config/env.js";

const AI_BASE = env.AI_SERVICE_URL;

export class AIGradingService extends IAIGradingService {
  async grade({
    filePath,
    mimeType,
    text,
    rubricFilePath,
    questions,
    assignmentTitle = "",
    courseName = "",
  }) {
    if (filePath) {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve("uploads", filePath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Submission file not found: ${absolutePath}`);
      }

      const form = new FormData();
      form.append("file", fs.createReadStream(absolutePath), {
        contentType: mimeType || "application/octet-stream",
      });

      if (rubricFilePath) {
        const absoluteRubricPath = path.isAbsolute(rubricFilePath) ? rubricFilePath : path.resolve("uploads", rubricFilePath);
        if (fs.existsSync(absoluteRubricPath)) {
          form.append("rubricFile", fs.createReadStream(absoluteRubricPath));
        }
      }

      form.append("questions", JSON.stringify(questions));
      form.append("assignmentTitle", assignmentTitle);
      form.append("courseName", courseName);

      const { data } = await axios.post(`${AI_BASE}/ai/grade`, form, {
        headers: form.getHeaders(),
        timeout: 120_000,
      });
      return data;
    }

    if (text) {
      const { data } = await axios.post(
        `${AI_BASE}/ai/grade/text`,
        { text, questions, assignmentTitle, courseName },
        { timeout: 120_000 }
      );
      return data;
    }

    throw new Error("Either filePath or text must be provided for AI grading");
  }
}
