import { CreateExperimentPayload, Experiment, ExperimentFilters } from "../types";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function listExperiments(filters: ExperimentFilters = {}): Promise<Experiment[]> {
  const url = new URL(`${API_BASE_URL}/experiments`);
  const params = new URLSearchParams();
  if (filters.owner) params.set("owner", filters.owner);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (Array.from(params.keys()).length > 0) {
    url.search = params.toString();
  }

  const response = await fetch(url.toString());
  return handleResponse<Experiment[]>(response);
}

export async function createExperiment(payload: CreateExperimentPayload): Promise<Experiment> {
  const response = await fetch(`${API_BASE_URL}/experiments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Experiment>(response);
}
