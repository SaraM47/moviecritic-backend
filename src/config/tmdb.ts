import { env } from "./env";

/*
Helper function used to communicate with the TMDB API. It constructs a request URL, attaches the API key and optional query parameters and returns the JSON response from TMDB
*/
export async function tmdbFetch(
  endpoint: string,
  params: Record<string, string> = {}
) {
  // Create a new URL by combining the TMDB base URL with the endpoint
  const url = new URL(`${env.TMDB_BASE_URL}${endpoint}`);

  // Attach the TMDB API key to every request
  url.searchParams.set("api_key", env.TMDB_API_KEY);

  // Add additional query parameters if they exist
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  /*
  Add timeout protection so the backend does not hang if TMDB becomes slow or unresponsive.
  */
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {

    // Send the request to the TMDB API
    const response = await fetch(url.toString(), {
      signal: controller.signal
    });

    clearTimeout(timeout);

    // If the request fails, throw an error
    if (!response.ok) {
      throw new Error("TMDB request failed");
    }

    // Return the parsed JSON response
    return response.json();

  } catch (error) {

    clearTimeout(timeout);

    throw new Error("TMDB API request timed out or failed");
  }
}