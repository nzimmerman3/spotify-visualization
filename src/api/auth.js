import axios from "axios";

const clientId = "b755a9e7b65447c8a5a7e13b918ef847"; //This is not a security risk to be made public
const redirectUri = "http://localhost:3000";

const scope = "user-top-read user-library-read playlist-read-private";
const authUrl = new URL("https://accounts.spotify.com/authorize");

export const authenticatedAxios = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
});

export async function tryAuth() {
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const codeVerifier = generateRandomString(64);

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  // generated in the previous step
  localStorage.setItem("code_verifier", codeVerifier);

  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

export function getAccessToken(code) {
  const codeVerifier = localStorage.getItem("code_verifier");
  return axios.post(
    "https://accounts.spotify.com/api/token",
    {
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}
