const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.addTopic = (slug, description) => {
  const formattedTopic = [slug, description];
  if (!slug || !description || typeof slug === "number") {
    return Promise.reject({ status: 400, message: "Bad request." });
  }
  return db
    .query(
      `INSERT INTO topics (slug, description)
      VALUES ($1, $2) RETURNING *`,
      formattedTopic
    )
    .then(({ rows }) => {
      // if (rows.length === 0) {
      //   return Promise.reject({ status: 404, message: "Article not found." });
      // }
      return rows[0];
    });
};
