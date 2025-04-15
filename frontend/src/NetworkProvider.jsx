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
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

export class NetworkProvider {

    static async search(table, name, surname, birthdate, unit) {
        const response = await API.get('/search', {
            params: {
                table,
                name,
                surname,
                birthdate,
                unit,
            },
        });
        return response.data;
    }

    static async update(table, data) {
        const params = {
            table,
            ...data
        }

        console.log(params);
        const response = await API.put('/update', params);
        return response.data;
    }

    static async registerUser(userData) {
        const response = await API.post('/register', userData);
        return response.data;
    }

    static async loginUser(credentials) {
        const response = await API.post('/login', credentials);
        return response.data;
    }

    static async getUser() {
        const response = await API.get('/user');
        return response.data;
    }

    static async updateUser(data) {
        const response = await API.put('/user', data);
        return response.data;
    }

    static async deleteUser() {
        const response = await API.delete('/user');
        return response.data;
    }

    static async logoutUser() {
        const response = await API.post('/logout');
        return response.data;
    }

    static async changePassword(currentPassword, newPassword) {
        const response = await API.put('/user/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
        });
        return response.data;
    }
}
