const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    url: {
      required: true,
      type: String,
    },
    artists: {
      required: true,
      type: Array,
    },
    played: {
      required: true,
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

module.exports = mongoose.model("Playlist", schema);
