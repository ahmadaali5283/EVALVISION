import apiClient from "./http";

export async function loginUser({ email, password }) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data; // { token, user }
}

export async function registerUser({ name, email, password, role }) {
  const { data } = await apiClient.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return data; // { token, user }
}

export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return data; // { user }
}
