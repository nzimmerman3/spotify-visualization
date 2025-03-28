"use client";
import React, { useState } from "react";
import Loading from "./Loading";
import Button from "@mui/material/Button";
import { getPlaylists } from "../api/spotify";
import { authenticatedAxios } from "../api/auth";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  async function playlists() {
    try {
      setLoading(true);
      const response = await getPlaylists();
      const playlists = response.data.items.map((item) => item.tracks.href);
      const playlistNameMap = {};
      response.data.items.forEach((item) => {
        playlistNameMap[item.href] = item.name;
      });

      console.log(playlistNameMap);

      const responses = await Promise.all(
        playlists.map((playlistHref) => authenticatedAxios.get(playlistHref))
      );
      debugger;
      const responsesData = responses.map(({ data }) => ({
        playlist: playlistNameMap[data.href.split("/tracks")[0]],
        songs: data.items.map((item) => ({
          name: item.track?.name,
          artists: item.track?.artists.map((artist) => artist.name),
        })),
      }));
      console.log(responsesData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="my-4">
      <h1 className="flex text-2xl font-bold">Dashboard</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex gap-4 my-4">
          <Button variant="contained" href="/dashboard/songs">
            Tracks
          </Button>
          <Button variant="contained" onClick={playlists}>
            Playlists
          </Button>
        </div>
      )}
    </div>
  );
}
