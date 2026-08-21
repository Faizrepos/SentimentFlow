const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (_error) {
    throw new Error(
      "Cannot connect to the backend. Make sure Flask is running on port 5000."
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (_error) {
    throw new Error("The backend returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export function analyzeText(text) {
  return request(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
}

export function getAnalyses() {
  return request(`${API_URL}/analyses`);
}

export function deleteAnalysis(id) {
  return request(`${API_URL}/analyses/${id}`, {
    method: "DELETE",
  });
}
