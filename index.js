const express = require("express");
const app = express();

const cors = require("express");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Db Connected");
  }
);

app.get("/", (req, res) => {
  res.send("Welcome to the tweeter API");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Listening on port" + port);
});
