const cors = require("cors");
const express = require("express");
const {
  sendUndeclaredEndpointError,
  sendCustomError,
  sendServerError,
  sendPsqlError,
} = require("./error_handlers/error_handlers");

const app = express();

const apiRouter = require("./routes/api-router");

app.use(cors());

app.use("/api", apiRouter);

//! Error handling middleware

app.all("*", sendUndeclaredEndpointError);

app.use(sendCustomError);

app.use(sendPsqlError);

app.use(sendServerError);

module.exports = app;
