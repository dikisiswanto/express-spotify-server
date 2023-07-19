require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mongoServer = process.env.DATABASE_URL;

mongoose.connect(mongoServer);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database connected");
});

const router = require("./routes/main");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/playlists", router);

app.listen(port, () => {
  console.log(`Express.js spotify server listening on port ${port}`);
});
