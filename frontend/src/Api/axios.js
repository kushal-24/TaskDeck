import axios from "axios";

const api=axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1", //import.meta.env for vite
    withCredentials: true,
    /*
    withCredentials: In browser networking, credentials =
    --> cookies: these are not directly sendt by axios, and r required to be sent to backend to verify access and refreshTokens
    --> authorization headers
     */
})

export default api;