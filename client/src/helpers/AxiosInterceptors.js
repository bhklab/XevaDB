import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        console.log(window.accessToken);
        const token = window?.accessToken || 'hello';

        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        return config;
    },
    error => {
        Promise.reject(error)
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        Promise.reject(error)
    }
);
