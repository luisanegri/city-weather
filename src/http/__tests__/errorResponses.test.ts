import MockAdapter from "axios-mock-adapter";
import { customAxios, CustomAxiosError } from "../interceptors";
import { queryClient } from "../../queryClientSetup";
import { WEATHER_DATA_KEY } from "../../utils/constants";

describe("interceptors error responses", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(customAxios);
  });

  afterEach(() => {
    mock.reset();
    jest.mocked(queryClient.removeQueries).mockClear();
  });

  it("should handle a 500 server error", async () => {
    mock.onGet("weather").reply(500);

    try {
      await customAxios.get("weather");
    } catch (error) {
      const customError = error as CustomAxiosError;
      expect(customError.customMessage).toBe(
        "We're experiencing server issues. Please try again later."
      );
    }
  });

  it("should handle a 503 service unavailable error", async () => {
    mock.onGet("weather").reply(503);

    try {
      await customAxios.get("weather");
    } catch (error) {
      const customError = error as CustomAxiosError;
      expect(customError.customMessage).toBe(
        "The service is temporarily unavailable. Please try again later."
      );
    }
  });

  it("should handle a 400 bad request error", async () => {
    mock.onGet("weather").reply(400);

    try {
      await customAxios.get("weather");
    } catch (error) {
      const customError = error as CustomAxiosError;
      expect(customError.customMessage).toBe(
        "There was a problem with the request. Please try again."
      );
    }
  });

  it("should handle a 401 unauthorized error and clear cache", async () => {
    const removeQueriesMock = jest.mocked(queryClient.removeQueries);
    mock.onGet("weather").reply(401);

    try {
      await customAxios.get("weather");
    } catch (error) {
      const customError = error as CustomAxiosError;
      expect(customError.customMessage).toBe(
        "You are not authorized to access this data."
      );
      expect(removeQueriesMock).toHaveBeenCalledWith([WEATHER_DATA_KEY]);
    }
  });

  it("should handle a 404 not found error", async () => {
    mock.onGet("weather").reply(404);

    try {
      await customAxios.get("weather");
    } catch (error) {
      const customError = error as CustomAxiosError;
      expect(customError.customMessage).toBe(
        "The requested data was not found. Please check back later."
      );
    }
  });

  it("should handle a 408 request timeout error", async () => {
    mock.onGet("weather").reply(408);

    try {
      await customAxios.get("weather");
    } catch (error) {
      const customError = error as CustomAxiosError;
      expect(customError.customMessage).toBe(
        "The request took too long. Please try again later."
      );
    }
  });

  it("should handle a 429 too many requests error", async () => {
    mock.onGet("weather").reply(429);

    try {
      await customAxios.get("weather");
    } catch (error) {
      const customError = error as CustomAxiosError;
      expect(customError.customMessage).toBe(
        "Too many requests. Please slow down and try again later."
      );
    }
  });
});
