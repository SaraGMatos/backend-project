const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  postArticle,
} = require("../controllers/articles.controllers");

articlesRouter.route("/").get(getAllArticles);

articlesRouter.route("/").post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
