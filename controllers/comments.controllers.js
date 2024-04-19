const {
  removeCommentById,
  updateCommentById,
} = require("../models/comments.models");

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

exports.patchCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  const postedVotesUpdate = req.body;

  updateCommentById(comment_id, postedVotesUpdate)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};
