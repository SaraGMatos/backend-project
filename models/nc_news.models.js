const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchAllArticles = (topic, queryKeys) => {
  const validQueryKeys = ["topic"];
  const queryValue = [];

  if (queryKeys.length !== 0) {
    for (let i = 0; i < validQueryKeys.length; i++) {
      if (!validQueryKeys.includes(queryKeys[i])) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
    }
  }

  let sqlString = `SELECT articles.title, articles.article_id, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN COMMENTS
  ON articles.article_id = comments.article_id `;

  if (topic) {
    sqlString += `WHERE articles.topic = $1 `;
    queryValue.push(topic);
  }

  sqlString += `GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;
  return db.query(sqlString, queryValue).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, 
    articles.body, CAST(COUNT(comments.article_id) AS INT) AS comment_count, articles.created_at, articles.votes, article_img_url 
    FROM articles 
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found." });
      }
      return rows[0];
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
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
};

exports.addCommentByArticleId = (article_id, { username, body }) => {
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
};

exports.updateArticleById = (article_id, { inc_votes }) => {
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
};

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

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

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
