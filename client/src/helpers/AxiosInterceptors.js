import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
        const token = window?.accessToken || 'hello';
        const configuration = config;

        if (token) {
            configuration.headers.Authorization = `Bearer ${token}`;
            console.log(token);
        }

        return configuration;
    },
    (error) => {
        Promise.reject(error);
    },
);

// Add a response interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        Promise.reject(error);
    },
);
