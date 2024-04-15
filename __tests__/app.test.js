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
    test("Responds with an array with all comment objects of a particular article", () => {});
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
