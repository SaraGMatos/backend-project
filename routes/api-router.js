const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send("All OK from API Router");
});

module.exports = apiRouter;
