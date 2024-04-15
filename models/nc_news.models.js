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
      `SELECT articles.article_id, comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM articles
      JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found." });
      }
      return rows;
    });
}

module.exports = {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
};
