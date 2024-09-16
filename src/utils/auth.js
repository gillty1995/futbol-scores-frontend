import { processServerRequest } from "./utils";

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
    const res = await fetch(`${baseUrl}/users`);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }
    const users = await res.json();
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Simulate a successful login with a token
      return { token: "mock-token", user };
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const checkToken = async () => {
  try {
    // Simulate token check by fetching users.
    const res = await fetch(`${baseUrl}/users`);
    return await processServerRequest(res);
  } catch (error) {
    console.error("Token check error:", error);
    throw error;
  }
};
