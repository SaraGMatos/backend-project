const express = require("express");
const { getAllTopics } = require("./controllers/nc_news.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
