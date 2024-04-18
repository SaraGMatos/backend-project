const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("../controllers/nc_news.controllers");

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
