const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/comments.controllers");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
