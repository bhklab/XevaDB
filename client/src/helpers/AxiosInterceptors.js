import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
        const token = window?.accessToken || 'hello';

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
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
