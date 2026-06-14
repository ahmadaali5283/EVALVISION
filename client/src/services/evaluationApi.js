import apiClient from "./http";

export async function getEvaluation(submissionId) {
  const { data } = await apiClient.get(`/evaluations/${submissionId}`);
  return data; // { evaluation }
}

export async function getEvaluationsByExam(examId) {
  const { data } = await apiClient.get(`/evaluations/exam/${examId}`);
  return data; // { count, evaluations }
}

export async function updateEvaluation(submissionId, payload) {
  const { data } = await apiClient.put(`/evaluations/${submissionId}`, payload);
  return data; 
}
