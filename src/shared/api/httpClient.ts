import type { z } from "zod";

// Wraps fetch with consistent JSON parsing and API error mapping.
export class ApiError extends Error {
  status?: number;
  causeData?: unknown;

  constructor(
    message: string,
    status?: number,
    causeData?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.causeData = causeData;
  }
}

type RetryOptions = {
  retries?: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
};

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function shouldRetry(status?: number) {
  if (status === undefined) return true;
  return status === 429 || status >= 500;
}

export async function fetchJson<T>(
  input: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
  retryOptions: RetryOptions = {}
): Promise<T> {
  const retries = retryOptions.retries ?? 2;
  const initialDelayMs = retryOptions.initialDelayMs ?? 250;
  const backoffMultiplier = retryOptions.backoffMultiplier ?? 2;

  let attempt = 0;
  let delayMs = initialDelayMs;
  let lastError: ApiError | undefined;

  while (attempt <= retries) {
    let response: Response;

    try {
      response = await fetch(input, init);
    } catch (error) {
      lastError = new ApiError("Network error while contacting API.", undefined, error);
      if (attempt === retries) break;
      await sleep(delayMs);
      delayMs *= backoffMultiplier;
      attempt += 1;
      continue;
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      throw new ApiError("API returned invalid JSON.", response.status, error);
    }

    if (!response.ok) {
      lastError = new ApiError("API request failed.", response.status, payload);
      if (!shouldRetry(response.status) || attempt === retries) break;
      await sleep(delayMs);
      delayMs *= backoffMultiplier;
      attempt += 1;
      continue;
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError("API payload validation failed.", response.status, parsed.error);
    }

    return parsed.data;
  }

  throw lastError ?? new ApiError("API request failed for unknown reasons.");
}
