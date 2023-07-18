const express = require("express");
const playlist = require("./models/playlist");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const handleError = (res, error) => {
  res.status(500).json({
    status: 500,
    message: error.message,
  });
};

app.get("/playlists/tracks", (req, res) => {
  try {
    const message = playlist.count()
      ? "Data retrieved successfully"
      : "No track data available";

    const { sort } = req.query;
    let allTracks = playlist.get();

    if (sort) {
      switch (sort) {
        case "desc":
          allTracks = allTracks.slice().sort((a, b) => b.played - a.played);
          break;
        case "asc":
          allTracks = allTracks.slice().sort((a, b) => a.played - b.played);
          break;
        default:
          throw new Error(
            "Invalid parameter. 'sort' only supports 'asc' or 'desc'"
          );
      }
    }

    res.status(200).json({
      message,
      data: allTracks,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/playlists/tracks", (req, res) => {
  const { title, url, artists } = req.body;
  try {
    if (!title || !artists || !url) {
      throw new Error(
        "Insufficient parameters: please provide title, url, and artists"
      );
    }
    const artistsArr = artists.split(",").map((artist) => artist.trim());
    const lastInsertedTrack = playlist.add({ title, url, artists: artistsArr });

    return res.status(201).json({
      message: "Successfully added to the playlist",
      data: lastInsertedTrack,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/playlists/tracks/:trackId", (req, res) => {
  try {
    const { trackId } = req.params;
    const track = playlist.find("id", trackId);
    res.status(200).json({
      message: "Data retrieved successfully",
      data: track,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/playlists/tracks/:trackId/play", (req, res) => {
  try {
    const { trackId } = req.params;
    const track = playlist.find("id", trackId);

    track["played"] += 1;

    const updatedTrack = playlist.update(track, track.id);

    res.status(200).json({
      message: "Now playing the requested track",
      data: updatedTrack,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.listen(port, () => {
  console.log(`Express.js spotify server listening on port ${port}`);
});
