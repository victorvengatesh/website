const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000/api/v1";


export async function apiFetch(
  endpoint,
  options = {},
) {
  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    },
  );

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Something went wrong. Please try again.",
    );
  }

  return data;
}
