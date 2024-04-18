const express = require("express");
const {
  sendUndeclaredEndpointError,
  sendCustomError,
  sendServerError,
  sendBadRequestPsqlError,
} = require("./error_handlers/nc_news.error_handlers");
const apiRouter = require("./routes/api-router");

const app = express();

app.use("/api", apiRouter);

//! Error handling middleware

app.all("*", sendUndeclaredEndpointError);

app.use(sendCustomError);

app.use(sendBadRequestPsqlError);

app.use(sendServerError);

module.exports = app;
