import apiClient from "./http";

/**
 * Trigger AI grading for a submission.
 * POST /api/ai/grade/:submissionId
 */
export async function gradeSubmission(submissionId) {
  const { data } = await apiClient.post(`/ai/grade/${submissionId}`, null, {
    timeout: 120_000, // OCR + LLM can be slow
  });
  return data;
}
