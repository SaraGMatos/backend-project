const express = require("express");
const {
  getAllTopics,
  getArticleById,
  getAllArticles,
} = require("./controllers/nc_news.controllers");
const {
  sendUndeclaredEndpointError,
  sendCustomError,
  sendServerError,
  sendSqlError,
} = require("./error_handlers/nc_news.error_handlers");
const endpoints = require("./endpoints.json");

const app = express();

app.get("/api", (req, res, next) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", sendUndeclaredEndpointError);

app.use(sendCustomError);

app.use(sendSqlError);

app.use(sendServerError);

module.exports = app;
