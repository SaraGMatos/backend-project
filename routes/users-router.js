const usersRouter = require("express").Router();
const {
  getAllUsers,
  getUserByUsername,
} = require("../controllers/nc_news.controllers");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
