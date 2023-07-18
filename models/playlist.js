const crypto = require("crypto");

const playlist = [];

const get = () => {
  return playlist;
};

const count = () => {
  return playlist.length;
};

const add = ({ title, url, artists }) => {
  const track = {
    id: crypto.randomBytes(16).toString("hex"),
    title,
    url,
    artists,
    played: 0,
    created_at: new Date().toISOString(),
  };
  playlist.push(track);
  return track;
};

const find = (key, value) => {
  const validKeys = ["id", "title"];
  if (!validKeys.includes(key)) {
    throw new Error(
      `Invalid key. Only ${validKeys.join(" and ")} keys are supported.`
    );
  }
  const track = playlist.find((track) => track[key] === value);
  if (!track) {
    throw new Error("Track not found in the playlist.");
  }
  return track;
};

const remove = (key, value) => {
  const validKeys = ["id", "title"];

  if (!validKeys.includes(key)) {
    throw new Error(
      `Invalid key. Only ${validKeys.join(" and ")} keys are supported.`
    );
  }

  const index = playlist.findIndex((item) => item[key] === value);

  if (index === -1) {
    throw new Error("Track not found in the playlist.");
  }

  playlist.splice(index, 1);
};

const update = (newTrack, trackId) => {
  const trackIndex = playlist.findIndex((track) => track.id === trackId);

  if (trackIndex === -1) {
    throw new Error('Track not found in the playlist.');
  }

  playlist[trackIndex] = {
    ...playlist[trackIndex],
    ...newTrack
  };

  return playlist[trackIndex];
}

module.exports = { get, count, add, update, find, remove };
