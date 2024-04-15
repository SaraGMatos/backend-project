exports.sendUndeclaredEndpointError = (req, res) => {
  res.status(404).send({ message: "Endpoint not found." });
};

exports.sendCustomError = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
};

exports.sendSqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request." });
  }
  next(err);
};

exports.sendServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
};
