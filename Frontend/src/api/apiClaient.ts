import axios from "axios";


const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
            "Content-Type": "application/json",

    },
    withCredentials: true,
});


// Automatically add token to requests


apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;

    };

    return config;

});


export default apiClient;