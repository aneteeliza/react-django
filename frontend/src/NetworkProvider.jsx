// utils/networkProvider.js
import axios from 'axios';

// Helper to read the CSRF token from cookies
const getCSRFToken = () => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
};


// Axios instance
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach CSRF token to every request
API.interceptors.request.use(config => {
    const csrfToken = getCSRFToken();
    console.log(csrfToken);
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

API.defaults.withCredentials = true;

export class NetworkProvider {

    static async search(table, name, surname, birthdate, unit) {
        const params = {};

        if (table) params.table = table;
        if (name) params.name = name;
        if (surname) params.surname = surname;
        if (birthdate) params.birthdate = birthdate;
        if (unit) params.unit = unit;

        const response = await API.get('/api/search', { params });
        return response.data;
    }


    static async update(table, data) {
        const params = {
            table,
            ...data
        }

        const response = await API.put('/api/update', params);
        return response.data;
    }


    static async registerUser(userData) {
        const response = await API.post('/api/register', userData);
        return response.data;
    }

    static async loginUser(credentials) {
        const response = await API.post('/api/login', credentials);
        return response.data;
    }

    static async activateUser(uid, token) {
        const response = await API.get('/api/user/activate', {
            params: { uid, token }
        });
        return response.data;
    }


    static async getUser() {
        const response = await API.get('/api/user');
        return response.data;
    }

    static async updateUser(data) {
        const response = await API.put('/api/user', data, { withCredentials: true});
        return response.data;
    }

    static async deleteUser() {
        const response = await API.delete('/api/user');
        return response.data;
    }

    static async logoutUser() {
        const response = await API.post('/api/logout');
        return response.data;
    }

    static async changePassword(currentPassword, newPassword) {
        const response = await API.put('/api/user/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
        });
        return response.data;
    }
}
