import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCommanderData } from "./useCommanderData";

const fetchMock = vi.fn<typeof fetch>();

describe("useCommanderData integration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("loads data through HTTP adapters when mock mode is disabled", async () => {
    vi.stubEnv("VITE_USE_MOCK_API", "false");
    vi.stubEnv("VITE_API_BASE_URL", "https://example.test/api");

    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              name: "Vilma",
              passIndex: 0,
              passName: "north_arc_2148",
              modeLabel: "PROG",
              seedAz: 102.75,
              seedEl: 4.22,
              seedBars: [42, 76, 29],
            },
          ]),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([{ name: "Julia", date: "26-04-30", time: "12:10" }]),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ labels: ["X", "S", "S"] }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ azLabel: "Az", elLabel: "El" }), {
          status: 200,
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCommanderData());

    await waitFor(() => {
      expect(result.current.data.passCards).toHaveLength(1);
      expect(result.current.data.inactiveCards).toHaveLength(1);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.errorMessage).toBeNull();
    });

    expect(fetchMock).toHaveBeenCalledWith("https://example.test/api/passes/cards", undefined);
    expect(fetchMock).toHaveBeenCalledWith("https://example.test/api/passes/inactive", undefined);
    expect(fetchMock).toHaveBeenCalledWith("https://example.test/api/signal/config", undefined);
    expect(fetchMock).toHaveBeenCalledWith("https://example.test/api/tracking/config", undefined);
  });

  it("falls back to default mock-backed state shape immediately", () => {
    vi.stubEnv("VITE_USE_MOCK_API", "true");
    const { result } = renderHook(() => useCommanderData());

    expect(result.current.data.signalConfig.labels).toEqual(["X", "S", "S"]);
    expect(result.current.data.trackingConfig.azLabel).toBe("Az");
    expect(result.current.data.trackingConfig.elLabel).toBe("El");
  });

  it("exposes an error message when HTTP loading fails", async () => {
    vi.stubEnv("VITE_USE_MOCK_API", "false");
    vi.stubEnv("VITE_API_BASE_URL", "https://example.test/api");
    fetchMock.mockImplementation(async () =>
      new Response(JSON.stringify({ message: "down" }), { status: 503 })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCommanderData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.errorMessage).toBe("API request failed.");
    });
  });
});
