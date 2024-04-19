const topicsRouter = require("express").Router();
const {
  getAllTopics,
  postTopic,
} = require("../controllers/topics.controllers");

topicsRouter.get("/", getAllTopics);

topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
