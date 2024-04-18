const usersRouter = require("express").Router();
const { getAllUsers } = require("../controllers/nc_news.controllers");

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;
