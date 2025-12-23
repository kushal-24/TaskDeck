 import api from "./axios.js";
 import axios from "axios";

/**
 * Login user
 * @param {Object} data { email, password }
 */
export const loginApi = (data) => {
  return api.post("/user/login", data);
};

/**
 * Signup user
 * @param {Object} data { name, email, password }
 */
export const signupApi = (data) => {
  return api.post("/user/signup", data);
};

/**
 * Logout user
 */
export const logoutApi = () => {
  return api.post("/user/logout");
};

/**
 * Get currently logged-in user
 */
export const getMeApi = () => {
  return api.get("/user/myprofile");
};
