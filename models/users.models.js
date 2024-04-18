const db = require("../db/connection");
const { checkIfUsernameExists } = require("../util_functions/utils");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return checkIfUsernameExists(username)
    .then(() => {
      return db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    })
    .then(({ rows: user }) => {
      return user[0];
    });
};
