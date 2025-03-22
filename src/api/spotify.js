import { authenticatedAxios } from "./auth";

export function getTopTracks(timeRange) {
  return authenticatedAxios.get(
    `/me/top/tracks?limit=50&time_range=${timeRange}`
  );
}

export function getPlaylists() {
  return authenticatedAxios.get("/me/playlists");
}
