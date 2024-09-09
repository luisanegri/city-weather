import MockAdapter from "axios-mock-adapter";
import { customAxios, CustomAxiosError } from "../interceptors";

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
