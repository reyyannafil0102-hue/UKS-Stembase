import api from "./api";

export async function login(email, password) {
  const response = await api.post("/login", {
    email,
    password,
  });

  return response.data;
}

export async function logout() {
  const response = await api.post("/logout");

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return response.data;
}

export async function getUser() {
  const response = await api.get("/user");

  return response.data;
}