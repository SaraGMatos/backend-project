const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  checkIfArticleExists,
  addCommentByArticleId,
  updateArticleById,
  removeCommentById,
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
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
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
  Promise.all([
    fetchCommentsByArticleId(article_id),
    checkIfArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const postedCommentInfo = req.body;

  Promise.all([
    checkIfArticleExists(article_id),
    addCommentByArticleId(article_id, postedCommentInfo),
  ])
    .then((comment) => {
      const commentToPost = comment[1];

      res.status(201).send({ comment: commentToPost });
    })
    .catch((error) => {
      next(error);
    });
}

function patchArticleById(req, res, next) {
  const { article_id } = req.params;
  const postedVotesUpdate = req.body;

  updateArticleById(article_id, postedVotesUpdate)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = {
  getAllTopics,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  updateArticleById,
  deleteCommentById,
};
