import axios from 'axios';


const api = axios.create({
  baseURL: 'https://projectidgeneration.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle API errors globally
api.interceptors.response.use(
  // If the request was successful, just return the response
  (response) => response,
  // If there was an error, parse it and return a standardized error message
  (error) => {
    // If the error has a response and data, pass it along.
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }

    // Handle network errors or other issues without a response.
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.request) {
      errorMessage = 'Could not connect to the server. Please check your network connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject({ message: errorMessage });
  }
);

export default api;
