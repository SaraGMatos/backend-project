const {
  fetchAllTopics,
  fetchArticleById,
} = require("../models/nc_news.models");

function getAllTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      console.log(article);
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getAllTopics, getArticleById };
