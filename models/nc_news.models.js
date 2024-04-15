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

module.exports = { fetchAllTopics, fetchArticleById, fetchAllArticles };
