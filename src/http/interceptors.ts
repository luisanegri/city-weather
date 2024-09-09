import axios, { AxiosError, AxiosInstance } from "axios";
import { queryClient } from "../queryClientSetup";
import { MergedWeatherData } from "../types/weatherTypes";
import { WEATHER_DATA_KEY } from "../utils/constants";

export const customAxios: AxiosInstance = axios.create({
  baseURL: "https://us-central1-mobile-assignment-server.cloudfunctions.net/",
  timeout: 10000,
});

export interface CustomAxiosError extends AxiosError {
  customMessage?: string;
}

const handleErrorResponse = (error: AxiosError): string => {
  const status = error.response?.status;

  if (status === 500) {
    return "We're experiencing server issues. Please try again later.";
  }

  if (status === 503) {
    return "The service is temporarily unavailable. Please try again later.";
  }

  if (status === 400) {
    return "There was a problem with the request. Please try again.";
  }

  if (status === 401 || status === 403) {
    queryClient.removeQueries([WEATHER_DATA_KEY]);
    return "You are not authorized to access this data.";
  }

  if (status === 408) {
    return "The request took too long. Please try again later.";
  }

  if (status === 404) {
    return "The requested data was not found. Please check back later.";
  }

  if (status === 429) {
    return "Too many requests. Please slow down and try again later.";
  }

  return "An error occurred while fetching data.";
};

const handleRequestError = async (error: AxiosError): Promise<any> => {
  const cachedData = queryClient.getQueryData<MergedWeatherData>([
    WEATHER_DATA_KEY,
  ]);

  if (cachedData) {
    console.log("Using cached data due to request error.", cachedData);
    return {
      data: cachedData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: error.config,
      cached: true,
    };
  }

  return Promise.reject(
    error.response ??
      new Error(
        "Unable to get a response from the server. Please check your internet connection."
      )
  );
};

customAxios.interceptors.response.use(
  (response) => {
    console.log("Request successful:", response);
    return response;
  },
  async (error: AxiosError) => {
    let errorMessage = "An unexpected error occurred.";

    if (error.response) {
      errorMessage = handleErrorResponse(error);
    } else if (error.request) {
      return handleRequestError(error);
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "The request took too long. Please try again.";
    }

    (error as CustomAxiosError).customMessage = errorMessage;
    return Promise.reject(error);
  }
);
