const express = require("express");
const {
  sendUndeclaredEndpointError,
  sendCustomError,
  sendServerError,
  sendPsqlError,
} = require("./error_handlers/error_handlers");
const apiRouter = require("./routes/api-router");

const app = express();

app.use("/api", apiRouter);

//! Error handling middleware

app.all("*", sendUndeclaredEndpointError);

app.use(sendCustomError);

app.use(sendPsqlError);

app.use(sendServerError);

module.exports = app;
