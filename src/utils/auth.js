import { processServerRequest } from "./utils";

// Correct baseUrl setup
const baseUrl = "http://localhost:3001";

export const registUser = async ({ email, password, name }) => {
  try {
    console.log("Registering user with data:", { email, password, name });
    const res = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    return await processServerRequest(res);
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await processServerRequest(res);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const checkToken = async (token) => {
  try {
    const res = await fetch(`${baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await processServerRequest(res);
  } catch (error) {
    console.error("Token check error:", error);
    throw error;
  }
};
