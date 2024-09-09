import MockAdapter from "axios-mock-adapter";
import { customAxios } from "../interceptors";
import { WeatherData } from "../../types/weatherTypes";

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
