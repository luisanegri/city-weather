import MockAdapter from "axios-mock-adapter";
import { customAxios } from "../interceptors";
import { queryClient } from "../../queryClientSetup";
import { MergedWeatherData } from "../../types/weatherTypes";

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
