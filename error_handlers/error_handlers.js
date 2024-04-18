exports.sendUndeclaredEndpointError = (req, res) => {
  res.status(404).send({ message: "Endpoint not found." });
};

exports.sendCustomError = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
};

exports.sendPsqlError = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    res.status(400).send({ message: "Bad request." });
  }
  next(err);
};

exports.sendServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
};
