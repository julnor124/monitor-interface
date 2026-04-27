// Centralizes runtime flags for choosing mock or HTTP API adapters.
export function getRuntimeConfig() {
  const useMockApis = import.meta.env.VITE_USE_MOCK_API !== "false";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

  return {
    useMockApis,
    apiBaseUrl,
  };
}
