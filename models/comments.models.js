const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Comment not found." });
      }
      return db.query(`DELETE FROM comments WHERE comment_id = $1`, [
        comment_id,
      ]);
    });
};

exports.updateCommentById = (comment_id, { inc_votes }) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment not found.",
        });
      }
      return rows[0];
    });
};
