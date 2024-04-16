const db = require("../db/connection");

function fetchAllTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

function fetchAllArticles() {
  return db
    .query(
      `SELECT articles.title, articles.article_id, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN COMMENTS
      ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
}

function fetchArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found." });
      }
      return rows[0];
    });
}

function fetchCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT * FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function checkIfArticleExists(article_id) {
  return db
    .query(
      `SELECT * FROM articles 
      WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found." });
      }
    });
}

function addCommentByArticleId(article_id, { username, body }) {
  const author = username;
  const votes = 0;

  const formattedComment = [body, article_id, author, votes];
  return db
    .query(
      `INSERT INTO comments (body, article_id, author, votes) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      formattedComment
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function updateArticleById(article_id, { inc_votes }) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article not found.",
        });
      }
      return rows[0];
    });
}

function removeCommentById(comment_id) {
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
}

module.exports = {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  checkIfArticleExists,
  addCommentByArticleId,
  updateArticleById,
  removeCommentById,
};
