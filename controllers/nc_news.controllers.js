const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
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

function getAllArticles(req, res, next) {
  fetchAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getAllTopics,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
};
