import axios, { AxiosError, AxiosInstance } from 'axios';

import { queryClient } from '../queryClientSetup';
import { MergedWeatherData } from '../types/weatherTypes';
import { WEATHER_DATA_KEY } from '../utils/constants';

export const customAxios: AxiosInstance = axios.create({
    baseURL: "https://us-central1-mobile-assignment-server.cloudfunctions.net/",
    timeout: 10000,
});

customAxios.interceptors.response.use(
    response => {
        console.log("Interceptor: Successful Response:", response);
        return response;
    },
    async (error: AxiosError) => {
        console.log("Interceptor: Error Detected:", error.message);

        let errorMessage: string;

        if (error.response) {
            console.log("Interceptor: Error Response Detected:", error.response);
            if (error.response.status === 500) {
                errorMessage = "We're experiencing server issues. Please try again later.";
            } else {
                errorMessage = "An error occurred while fetching data.";
            }
        } else if (error.request) {
            console.log("Interceptor: Error Request Detected:", error.request);

            const cachedData = queryClient.getQueryData<MergedWeatherData>([WEATHER_DATA_KEY]);
            console.log("Interceptor: Attempting to Fetch Cached Data:", cachedData);

            if (cachedData) {
                console.log("Interceptor: Cached Data Found:", cachedData);
                return Promise.resolve({ data: cachedData });
            } else {
                console.log("Interceptor: No Cached Data Found");
                errorMessage = "Unable to get a response from the server. Please check your internet connection.";
            }
        } else {
            console.log("Interceptor: Unexpected Error Detected:", error);
            errorMessage = "An unexpected error occurred.";
        }

        // Attach a custom message to the error object
        error.message = errorMessage;

        // Forward the error for further handling
        return Promise.reject(error);
    }
);
