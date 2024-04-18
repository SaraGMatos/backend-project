const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/nc_news.controllers");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
