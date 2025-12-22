import api from "./axios";

/**
 * Login user
 * @param {Object} data { email, password }
 */
export const loginApi = (data) => {
  return api.post("/auth/login", data);
};

/**
 * Signup user
 * @param {Object} data { name, email, password }
 */
export const signupApi = (data) => {
  return api.post("/auth/signup", data);
};

/**
 * Logout user
 */
export const logoutApi = () => {
  return api.post("/auth/logout");
};

/**
 * Get currently logged-in user
 */
export const getMeApi = () => {
  return api.get("/auth/me");
};
