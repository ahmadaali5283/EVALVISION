import apiClient from "./http";

export async function listExams() {
  const { data } = await apiClient.get("/exams");
  return data; // { count, exams }
}

export async function getExam(examId) {
  const { data } = await apiClient.get(`/exams/${examId}`);
  return data; // { exam }
}

export async function getExamAnalytics(examId) {
  const { data } = await apiClient.get(`/exams/${examId}/analytics`);
  return data;
}

export async function createExam(payload) {
  const { data } = await apiClient.post("/exams", payload);
  return data; // { exam }
}

export async function updateExam(examId, payload) {
  const { data } = await apiClient.put(`/exams/${examId}`, payload);
  return data; // { exam }
}

export async function deleteExam(examId) {
  const { data } = await apiClient.delete(`/exams/${examId}`);
  return data;
}
