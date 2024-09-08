import MockAdapter from "axios-mock-adapter";
import { customAxios, CustomAxiosError } from "../interceptors";
import { queryClient } from "../../queryClientSetup";
import { WEATHER_DATA_KEY } from "../../utils/constants";
import { MergedWeatherData, WeatherData } from "../../types/weatherTypes";

describe("interceptors success response", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(customAxios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should handle a successful response", async () => {
    const mockData: WeatherData = {
      city: {
        name: "New York",
        picture: "US",
      },
      date: "2024-09-08",
      temp: 25,
      tempType: "Celsius",
    };

    mock.onGet("weather").reply(200, mockData);

    const response = await customAxios.get("weather");
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });
});

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
});

describe("interceptors network error and cache fallback", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(customAxios);

    const mockCachedData: MergedWeatherData = {
      "New York": {
        city: {
          name: "New York",
          picture: "US",
        },
        weather: [
          {
            date: "2024-09-08",
            temp: 30,
            tempType: "Celsius",
          },
        ],
      },
    };

    jest.mocked(queryClient.getQueryData).mockReturnValue(mockCachedData);

    console.log("Mocked cached data set for queryClient.getQueryData");
  });

  afterEach(() => {
    mock.reset();
    jest.mocked(queryClient.getQueryData).mockClear();
  });

  it("should fallback to cached data if request fails", async () => {
    mock.onGet("weather").networkError();

    try {
      const response = await customAxios.get("weather");
      expect(response.data["New York"].city.name).toBe("New York");
      expect(response.data["New York"].weather[0].temp).toBe(30);
    } catch (error) {
      console.log("Error caught during the test execution:", error);
    }
  });
});

describe("interceptors timeout error", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(customAxios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should handle request timeout error", async () => {
    mock.onGet("weather").timeout();

    try {
      await customAxios.get("weather");
    } catch (error) {
      const customError = error as CustomAxiosError;
      expect(customError.customMessage).toBe(
        "The request took too long. Please try again."
      );
    }
  });
});
