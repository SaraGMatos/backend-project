const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const endpointsFile = require("../endpoints.json");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api", () => {
  test("GET 200: Responds with the endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;

        expect(endpoints).toStrictEqual(endpointsFile);
      });
  });
});

describe("/api/topics", () => {
  describe("GET /api/topics", () => {
    test("GET 200: Responds with an array to the client with all topic objects in the correct format", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;

          expect(topics.length).toBe(3);

          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });

    test("POST 201: Responds with the posted topic object and the required keys", () => {
      return request(app)
        .post("/api/topics")
        .send({
          slug: "mocha",
          description: "why not?",
        })
        .expect(201)
        .then(({ body }) => {
          const { topic } = body;

          expect(topic).toMatchObject({
            slug: "mocha",
            description: "why not?",
          });
        });
    });

    test("POST 400: Responds with an adequate status and error message when provided with an incomplete body", () => {
      return request(app)
        .post("/api/topics")
        .send({ slug: "mocha" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("POST 400: Responds with an adequate status and error message when the data type of the body's property values are not correct", () => {
      return request(app)
        .post("/api/topics")
        .send({ slug: 90, description: "This is not false" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET /api/articles", () => {
    test("GET 200: Responds with an array of all article objects with the required properties in desc order by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body.articles;
          expect(total_count).toBe(13);

          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
          });

          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("GET 200: Accepts a topic query and responds with an array of articles of that topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body.articles;
          expect(total_count).toBe(12);

          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });

    test("GET 200: Accepts a sort-by query which sorts the articles by any valid column, defaulting to created_at", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body.articles;
          expect(articles).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });

    test("GET 200: Accepts an order query which orders the articles by created_at, defaulting to desc", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body.articles;
          expect(articles).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });

    test("GET 200: Accepts a limit query which limits the number of rows returned", () => {
      return request(app)
        .get("/api/articles?limit=9")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body.articles;
          expect(articles.length).toBe(9);
          expect(total_count).toBe(13);
        });
    });

    test("GET 200: Limit defaults to 10 when not passed", () => {
      return request(app)
        .get("/api/articles?")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body.articles;
          expect(articles.length).toBe(10);
          expect(total_count).toBe(13);
        });
    });

    test("GET 200: Response should have an added total_count property displaying the total numbers of articles with any filters applied, except limit", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body.articles;
          expect(articles.length).toBe(5);
          expect(total_count).toBe(13);
        });
    });

    test("GET 200: Accepts a second p query that specifies the page at which the response starts", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc&limit=5&p=2")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body.articles;

          expect(articles.length).toBe(5);
          expect(articles[0]).toHaveProperty("article_id", 6);
          expect(total_count).toBe(13);
        });
    });

    test("GET 200: The p query works for different pages", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc&limit=3&p=5")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body.articles;

          expect(articles.length).toBe(1);
          expect(articles[0]).toHaveProperty("article_id", 13);
          expect(total_count).toBe(13);
        });
    });

    test("GET 404: Responds with an adequate error when the page does not exist", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc&limit=3&p=6")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not found");
        });
    });

    test("GET 400: Responds with an adequate error when the page value is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc&limit=3&p=hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("GET 400: Responds with an error when the sort_by query does not exist", () => {
      return request(app)
        .get("/api/articles?sort_by=wrong_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("GET 400: Responds with an error when the order query does not exist", () => {
      return request(app)
        .get("/api/articles?order=wrong_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("GET 404: Responds with an adequate error when the topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=mocha")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not found");
        });
    });

    test("GET 400: Responds with an adequate error when the column name passed does not exist", () => {
      return request(app)
        .get("/api/articles?inexistent=author")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Column invalid.");
        });
    });
  });

  describe("POST /api/articles", () => {
    test("POST 201: Responds with the posted article", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "How to make a tomato soup with mitch",
          body: "Call mitch. Throw some tomatoes in a pan and cook them for a bit.",
          topic: "mitch",
          article_img_url: "some pic url",
        })
        .expect(201)
        .then(({ body }) => {
          const { article } = body;

          expect(article).toMatchObject({
            article_id: 14,
            author: "butter_bridge",
            title: "How to make a tomato soup with mitch",
            body: "Call mitch. Throw some tomatoes in a pan and cook them for a bit.",
            topic: "mitch",
            votes: 0,
            comment_count: 0,
          });
          expect(article.article_img_url).toEqual(expect.any(String));
          expect(article.created_at).toEqual(expect.any(String));
        });
    });

    test("POST 400: Responds with an adequate status and error message when provided with an incomplete body", () => {
      return request(app)
        .post("/api/articles")
        .send({ author: "butter_bridge" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("POST 400: Responds with an adequate status and error message when the data type of the body's property values are not correct", () => {
      return request(app)
        .post("/api/articles")
        .send({ author: 90, body: "This is not false" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("POST 404: Responds with an adequate status and error message when the username does not exist", () => {
      return request(app)
        .post("/api/articles")
        .send({ author: "Liam", body: "I like coding" })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not found");
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("GET 200: Responds with the required article object", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article.article_id).toBe(3);
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.body).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
    });

    test("GET 200: Responds with an article object containing an added comment_count property", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article.comment_count).toBe(2);
        });
    });

    test("GET 404: Responds with an error when passed a non-existent id", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article not found.");
        });
    });

    test("GET 400: Responds with an error when passed an id of an invalid data type", () => {
      return request(app)
        .get("/api/articles/invalid-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("PATCH 200: Responds with the updated article object", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({ inc_votes: 20 })
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article.article_id).toBe(5);
          expect(article.votes).toBe(20);

          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.body).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
        });
    });

    test("PATCH 404: Responds with an adequate status and message when provided with a valid but non-existent ID", () => {
      return request(app)
        .patch("/api/articles/99999")
        .send({ inc_votes: 20 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article not found.");
        });
    });

    test("PATCH 400: Responds with an adequate status and message when provided with an invalid id", () => {
      return request(app)
        .patch("/api/articles/invalid-id")
        .send({ inc_votes: 20 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("PATCH 400: Responds with an adequate status and error message when the data type of the input's property values are not correct", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({ inc_votes: "invalid-data" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("PATCH 400: Responds with an adequate status and error message when provided with an incomplete body", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });
  });

  describe("DELETE /api/articles/:article_id", () => {
    test("DELETE 204: Deletes the specified article and sends no body back", () => {
      return request(app).delete("/api/articles/2").expect(204);
    });

    test("DELETE 404: Responds with an appropriate status and error message when given a non-existent id", () => {
      return request(app)
        .delete("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article not found.");
        });
    });

    test("DELETE 400: Responds with an appropiate status and error message when given an invalid id", () => {
      return request(app)
        .delete("/api/articles/invalid-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("GET 200: Responds with an array with all comment objects of a particular article with the required key-value pairs ordered from most recent", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(2);

          comments.forEach((comment) => {
            expect(comment.article_id).toBe(5);
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
          });

          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("GET 200: Responds with an empty array when article exists but has no comments associated", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;

          expect(comments.length).toBe(0);
        });
    });

    test("GET 200: Accepts a limit query which limits the number of rows returned", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;

          expect(comments.length).toBe(5);
        });
    });

    test("GET 200: Limit defaults to 10 when not passed", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;

          expect(comments.length).toBe(10);
        });
    });

    test("GET 200: Accepts a second p query that specifies the page at which the response starts", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5&p=2")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(5);
          expect(comments[0]).toHaveProperty("comment_id", 8);
        });
    });

    test("GET 200: The p query works for different pages", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=3&p=4")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(2);
          expect(comments[0]).toHaveProperty("comment_id", 4);
        });
    });

    test("GET 400: Responds with an adequate error when the page value is invalid", () => {
      return request(app)
        .get("/api/articles/1/comments?p=invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("GET 400: Responds with an adequate error when the column name passed does not exist", () => {
      return request(app)
        .get("/api/articles/1/comments?invalid=5")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Column invalid.");
        });
    });

    //! -------------------- NEW TESTS END

    test("GET 404: Responds with an error when passed a non-existent id", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not found.");
        });
    });

    test("GET 400: Responds with an error when passed an id of an invalid data type", () => {
      return request(app)
        .get("/api/articles/invalid-id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("POST 201: Responds with the posted comment", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          username: "butter_bridge",
          body: "I love napping in the sun!",
        })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;

          expect(comment).toMatchObject({
            comment_id: 19,
            body: "I love napping in the sun!",
            article_id: 3,
            author: "butter_bridge",
            votes: 0,
          });

          expect(comment.created_at).toEqual(expect.any(String));
        });
    });

    test("POST 400: Responds with an adequate status and error message when provided with an incomplete body", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("POST 400: Responds with an adequate status and error message when the data type of the body's property values are not correct", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: 90, body: "This is not false" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("POST 404: Responds with an adequate status and error message when the username does not exist", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "Mocha", body: "I love naps in the sun" })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not found");
        });
    });

    test("POST 400: Responds with an error when passed an id of an invalid data type", () => {
      return request(app)
        .post("/api/articles/invalid-id/comments")
        .send({ username: "butter_bridge", body: "I love napping in the sun!" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("POST 400: Responds with an error when passed a non-existent id", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .send({ username: "butter_bridge", body: "I love napping in the sun!" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });
  });
});

describe("api/comments", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("DELETE 204: Deletes the specified comment and sends no body back", () => {
      return request(app).delete("/api/comments/2").expect(204);
    });

    test("DELETE 404: Responds with an appropriate status and error message when given a non-existent id", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Comment not found.");
        });
    });

    test("DELETE 400: Responds with an appropiate status and error message when given an invalid id", () => {
      return request(app)
        .delete("/api/comments/invalid-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });
  });

  describe("PATCH /api/comments/:comment_id", () => {
    test("PATCH 200: Responds with the updated comment object", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: 20 })
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;

          expect(comment.comment_id).toBe(3);
          expect(comment.votes).toBe(120);

          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.created_at).toBe("string");
        });
    });

    test("PATCH 404: Responds with an adequate status and message when provided with a valid but non-existent ID", () => {
      return request(app)
        .patch("/api/comments/99999")
        .send({ inc_votes: 20 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Comment not found.");
        });
    });

    test("PATCH 400: Responds with an adequate status and error message when the data type of the input's property values are not correct", () => {
      return request(app)
        .patch("/api/comments/5")
        .send({ inc_votes: "invalid-data" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });

    test("PATCH 400: Responds with an adequate status and error message when provided with an incomplete body", () => {
      return request(app)
        .patch("/api/comments/5")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
        });
    });
  });
});

describe("api/users", () => {
  describe("GET /api/users", () => {
    test("GET 200: Responds with an array with all user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;

          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
  });

  describe("GET /api/users/:username", () => {
    test("GET 200: Responds with a user object with the required keys", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user.username).toBe("butter_bridge");
          expect(typeof body.user.avatar_url).toBe("string");
          expect(typeof body.user.name).toBe("string");
        });
    });
  });

  test("GET 404: Responds with adequate error and message when username does not exist", () => {
    return request(app)
      .get("/api/users/101")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
});

describe("Undeclared endpoints", () => {
  test("ALL 404: Responds with an error when the endpoint has not been found", () => {
    return request(app)
      .get("/api/undeclared-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Endpoint not found.");
      });
  });
});
