const { fetchAllTopics } = require("../models/nc_news.models");

function getAllTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getAllTopics };
