const { fetchAllTopics, addTopic } = require("../models/topics.models");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  addTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((error) => {
      next(error);
    });
};
