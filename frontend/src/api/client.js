const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:8000/api/v1";
async function handleResponse(response) {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `API request failed with status ${response.status}`);
    }
    return response.json();
}
export async function listExperiments(filters = {}) {
    const url = new URL(`${API_BASE_URL}/experiments`);
    const params = new URLSearchParams();
    if (filters.owner)
        params.set("owner", filters.owner);
    if (filters.status)
        params.set("status", filters.status);
    if (filters.search)
        params.set("search", filters.search);
    if (Array.from(params.keys()).length > 0) {
        url.search = params.toString();
    }
    const response = await fetch(url.toString());
    return handleResponse(response);
}
export async function createExperiment(payload) {
    const response = await fetch(`${API_BASE_URL}/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}
