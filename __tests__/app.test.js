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
  });
});

describe("/api/articles", () => {
  describe("GET /api/articles", () => {
    test("GET 200: Responds with an array of all article objects with the required properties in desc order by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;

          expect(articles.length).toBe(13);

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

    test("GET 404: Responds with an error when passed a non-existent id", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article not found.");
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
    test("Responds with the posted comment", () => {
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
        .send({ username: 200, body: false })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request.");
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

    test("POST 404: Responds with an error when passed a non-existent id", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .send({ username: "butter_bridge", body: "I love napping in the sun!" })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article not found.");
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
