import { processServerRequest } from "./utils";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";

if (import.meta.env.NODE_ENV === "production") {
  console.log("Running in production mode");
}

export const registUser = async ({ email, password, name }) => {
  try {
    console.log("Registering user with data:", { email, password, name });
    const res = await fetch(`${baseUrl}/signup`, {
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
    const res = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);

    return { token: data.token, user: data.user };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const checkToken = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await processServerRequest(res);
  } catch (error) {
    console.error("Token check error:", error);
    throw error;
  }
};

export const saveGame = async (gameData) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${baseUrl}/me/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gameData),
    });
    return await processServerRequest(res);
  } catch (error) {
    console.error("Error saving game:", error);
    throw error;
  }
};

export const getSavedGames = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${baseUrl}/me/games`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await processServerRequest(res);
  } catch (error) {
    console.error("Error fetching saved games:", error);
    throw error;
  }
};

export const unsaveGame = async (fixtureId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${baseUrl}/me/games/${fixtureId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await processServerRequest(res);
  } catch (error) {
    console.error("Error fetching saved games:", error);
    throw error;
  }
};
