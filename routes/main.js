const express = require("express");
const router = express.Router();
const Playlist = require("../models/playlist");

const handleError = (res, error) => {
  res.status(500).json({
    status: 500,
    message: error.message,
  });
};

router.get("/tracks", async (req, res) => {
  try {
    const { sort } = req.query;
    let allTracks = await Playlist.find();

    const totalTracks = await Playlist.count();
    const message = totalTracks
      ? "Data retrieved successfully"
      : "No track data available";

    if (sort) {
      allTracks = await Playlist.find().sort({ played: sort });
    }

    res.status(200).json({
      message,
      data: allTracks,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/tracks", async (req, res) => {
  const { title, url, artists } = req.body;
  try {
    if (!title || !artists || !url) {
      throw new Error(
        "Insufficient parameters: please provide title, url, and artists"
      );
    }
    const artistsArr = artists.split(",").map((artist) => artist.trim());
    const newTrack = new Playlist({ title, url, artists: artistsArr });
    const lastInsertedTrack = await newTrack.save();

    return res.status(201).json({
      message: "Successfully added to the playlist",
      data: lastInsertedTrack,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/tracks/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;
    const track = await Playlist.findById(trackId);

    res.status(200).json({
      message: "Data retrieved successfully",
      data: track,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/tracks/:trackId/play", async (req, res) => {
  try {
    const { trackId } = req.params;
    const updatedTrack = await Playlist.findByIdAndUpdate(
      trackId,
      { $inc: { played: 1 } },
      { new: true }
    );

    res.status(200).json({
      message: "Now playing the requested track",
      data: updatedTrack,
    });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
