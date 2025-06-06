import axios from "axios";

const API_URL= "https://finance-tracker-backend-zxc8.onrender.com"



const instance = axios.create({
    baseURL: API_URL + "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token if available
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default instance;
