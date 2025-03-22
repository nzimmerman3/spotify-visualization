"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getTopTracks } from "../api/spotify";
import Loading from "./Loading";
import Link from "next/link";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormHelperText } from "@mui/material";

export default function Songs() {
  const [shortSongs, setShortSongs] = useState([]);
  const [mediumSongs, setMediumSongs] = useState([]);
  const [longSongs, setLongSongs] = useState([]);

  const [timeframe, setTimeframe] = useState("short"); //short, medium, long

  useEffect(() => {
    async function init() {
      // todo
      try {
        const responses = await Promise.all([
          getTopTracks("short_term"),
          getTopTracks("medium_term"),
          getTopTracks("long_term"),
        ]);
        const responseData = responses.map(({ data }) =>
          data.items.map((item) => ({
            id: item.id,
            name: item.name,
            artists: item.artists.map((artist) => artist.name),
            link: item.external_urls.spotify,
          }))
        );
        setShortSongs(responseData[0]);
        setMediumSongs(responseData[1]);
        setLongSongs(responseData[2]);
      } catch (error) {
        console.error(error);
      }
    }
    init();
  }, []);

  function getSongs() {
    if (timeframe === "short") {
      return shortSongs;
    } else if (timeframe === "medium") {
      return mediumSongs;
    } else {
      return longSongs;
    }
  }

  function handleTimeframeChange(event) {
    setTimeframe(event.target.value);
  }

  const songs = getSongs();

  return (
    <>
      <h1 className="my-4 text-3xl font-bold">Top Songs</h1>
      <div className="flex justify-end mb-2">
        <div className="flex flex-col items-center">
          <Select
            value={timeframe}
            label="Time Period"
            onChange={handleTimeframeChange}
            size="small"
            sx={{ backgroundColor: "#1ED760", color: "black" }}
          >
            <MenuItem value="short">Short</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="long">Long</MenuItem>
          </Select>
          <FormHelperText>Time period</FormHelperText>
        </div>
      </div>
      {songs.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="bg-spotify-green border-2 border-solid border-black">
                <TableCell className="">Ranking</TableCell>
                <TableCell>Song</TableCell>
                <TableCell>Artist(s)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {songs.map(({ id, name, artists, link }, i) => (
                <TableRow
                  key={id}
                  className="border-b-2 border-x-2 border-solid border-black"
                >
                  <TableCell>#{i + 1}</TableCell>
                  <TableCell className="border-x-2 border-solid border-black">
                    <Link target="_blank" href={link}>
                      {name}
                    </Link>
                  </TableCell>
                  <TableCell>{artists.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Loading />
      )}
    </>
  );
}
