const db = require("../db/connection");

exports.checkIfArticleExists = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles 
        WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, message: "Not found." });
      }
    });
};

exports.checkIfTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows: topic }) => {
      if (topic.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return [];
    });
};

exports.checkIfUsernameExists = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows: username }) => {
      if (username.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return [];
    });
};

exports.checkUserAndBody = (username, body) => {
  if (typeof username === "number" || !body || !username) {
    return Promise.reject({ status: 400, message: "Bad request." });
  }

  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows: username }) => {
      if (username.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return [];
    });
};
