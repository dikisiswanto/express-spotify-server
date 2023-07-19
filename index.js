const express = require("express");
const router = require("./routes/main");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/playlists', router);

app.listen(port, () => {
  console.log(`Express.js spotify server listening on port ${port}`);
});
