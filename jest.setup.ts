import { ReactNode } from "react";

jest.mock("@tanstack/react-query", () => ({
  QueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    getQueryData: jest.fn(),
    removeQueries: jest.fn(),
  })),
  QueryClientProvider: ({ children }: { children: ReactNode }) => children,
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    isError: false,
  })),
}));
