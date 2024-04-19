const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentByID,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentByID);

module.exports = commentsRouter;
