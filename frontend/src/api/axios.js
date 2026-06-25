import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.DEV ? "http://localhost:8080" : window.location.origin,
});

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;