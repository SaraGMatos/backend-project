const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const endpoints = require("../endpoints.json");

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
      .then((response) => {
        expect(response.body.endpoints).toStrictEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  describe("GET /api/topics", () => {
    test("GET 200: Responds with an array to the client with all topic objects in the correct format", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics.length).toBe(3);
          response.body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET /api/articles/:article_id", () => {
    test("GET 200: Responds with the required article object", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          expect(response.body.article.article_id).toBe(3);
          expect(response.body.article.title).toBe(
            "Eight pug gifs that remind me of mitch"
          );
          expect(response.body.article.topic).toBe("mitch");
          expect(response.body.article.author).toBe("icellusedkars");
          expect(response.body.article.body).toBe("some gifs");
          expect(response.body.article.created_at).toBe(
            "2020-11-03T09:12:00.000Z"
          );
          expect(response.body.article.votes).toBe(0);
          expect(response.body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });

    test("GET 404: Responds with an error when passed a non-existent id", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe("Article not found.");
        });
    });

    test("GET 400: Responds with an error when passed an id of an invalid data type", () => {
      return request(app)
        .get("/api/articles/invalid-id")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad request.");
        });
    });
  });
});

describe("Undeclared endpoints", () => {
  test("ALL 404: Responds with an error when the endpoint has not been found", () => {
    return request(app)
      .get("/api/undeclared-endpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Endpoint not found.");
      });
  });
});
