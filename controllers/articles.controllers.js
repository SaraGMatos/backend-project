const {
  fetchAllArticles,
  fetchArticleById,
  updateArticleById,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  addArticle,
  removeArticleById,
} = require("../models/articles.models");
const {
  checkIfTopicExists,
  checkIfArticleExists,
} = require("../util_functions/utils");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, topic, order, limit, p } = req.query;

  const queryKeys = Object.keys(req.query);

  fetchAllArticles(sort_by, topic, order, limit, p, queryKeys)
    .then((articles) => {
      if (topic && articles.articles.length === 0) {
        return checkIfTopicExists(topic);
      }
      res.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  addArticle({ author, title, body, topic, article_img_url })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const postedVotesUpdate = req.body;

  updateArticleById(article_id, postedVotesUpdate)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  const queryKeys = Object.keys(req.query);

  Promise.all([
    fetchCommentsByArticleId(article_id, limit, p, queryKeys),
    checkIfArticleExists(article_id),
  ])
    .then((promises) => {
      const comments = promises[0];

      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  addCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};
