import axios, { AxiosError, AxiosInstance } from 'axios';

export const customAxios: AxiosInstance = axios.create({
    baseURL: "https://us-central1-mobile-assignment-server.cloudfunctions.net/",
    timeout: 1000,
});

customAxios.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        let errorMessage: string;

        if (error.response) {
            if (error.response.status === 500) {
                errorMessage = "We're experiencing server issues. Please try again later.";
            } else {
                errorMessage = "An error occurred while fetching data.";
            }
        } else if (error.request) {
            errorMessage = "Unable to get a response from the server. Please check your internet connection.";
        } else {
            errorMessage = "An unexpected error occurred.";
        }

        // Attach a custom message to the error object
        error.message = errorMessage;

        // Forward the error for further handling
        return Promise.reject(error);
    }
);
