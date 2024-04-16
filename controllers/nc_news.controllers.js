const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  checkIfArticleExists,
  addCommentByArticleId,
  updateArticleById,
  removeCommentById,
  fetchAllUsers,
} = require("../models/nc_news.models");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
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

exports.getCommentsByArticleId = (req, res, next) => {
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
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const postedCommentInfo = req.body;

  addCommentByArticleId(article_id, postedCommentInfo)
    .then((comment) => {
      res.status(201).send({ comment });
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
