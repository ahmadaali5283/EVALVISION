import apiClient from "./http";

export async function getSubmissionsByExam(examId) {
  const { data } = await apiClient.get(`/submissions/exam/${examId}`);
  return data; // { count, submissions }
}

export async function getSubmission(submissionId) {
  const { data } = await apiClient.get(`/submissions/${submissionId}`);
  return data; // { submission }
}

export async function createSubmission({ studentName, examId, answers }) {
  const { data } = await apiClient.post("/submissions", {
    studentName,
    examId,
    answers,
  });
  return data; // { submission }
}

export async function uploadSubmission(examId, formData) {
  const { data } = await apiClient.post(
    `/submissions/upload/${examId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60_000,
    }
  );
  return data;
}

export async function checkPlagiarism(examId) {
  const { data } = await apiClient.get(`/submissions/exam/${examId}/plagiarism`);
  return data; // { flagged }
}
