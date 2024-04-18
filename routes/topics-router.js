const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/nc_news.controllers");

topicsRouter.get("/", getAllTopics);

module.exports = topicsRouter;
