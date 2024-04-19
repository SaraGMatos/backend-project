# Northcoders News API

## What is it?

This is a RESTful API that allows users to interact with Northcoders News, a webapp similar to Reddit where users can read and post articles as well as comment and vote them.

This API has been developed using Node.js, Postgres and Express.

Pssst! The Render hosted version for this project is here: *https://nc-news-app-jnwm.onrender.com/api*

## Installation

1. Before you go any further, check that you have at least the following versions:

   - For _Node.js_: v21.6.1

   - For _Postgres_: v16.2

Please follow the steps below to run this project locally:

2. If you do not have _node.js_ installed on your machine, please follow the node.js installation guide: *https://nodejs.org/en/learn/getting-started/how-to-install-nodejs*.

3. Clone this repository by pasting the following on your terminal: `git clone https://github.com/SaraGMatos/backend-project`.

4. Once you are in the project folder, install node package manager (npm) to set up needed dependencies. Paste this on your terminal: `npm install`.

5. Create your test environment variable. Add an `env.development` file to the project root and, inside, set the development environment variable: `PGDATABASE=nc_news`.

6. Create your development environment variable.Add an `.env.test` file to the project root and, inside, set the test environment variable: `PGDATABASE=nc_news_test`.

7. Add these two files to `.gitignore`.

   \*Please note that you will need to set another `.env` file if you wish to host this project online.

8. Create your databases locally running `npm run setup-dbs` on your terminal.

9. The test databases will be re-seeded with every test run, using the command `npm test`. Note we are using Jest as our testing framework.

10. To seed the development database, please run `npm run seed`.

11. Finally, to start the server, use `npm run start`. It will run on port 9090 by deafult.

## Files

- The _endpoints.json_ file contains a detailed list of all available endpoints on the Northcoders News API, in the form of a JSON object.

## Endpoints

### /api

- _GET_: Responds with a list of all the endpoints that can be interacted with.

### /api/users

- _GET_: Responds with an array of all user objects and the required keys (username, name, avatar_url).

### /api/users/:username

- _GET_: Responds with the specified user object and its required keys (username, name, avatar_url).

### /api/topics

- _GET_: Responds with an array of all topic objects and the required keys (slug, description).

### /api/articles

- _GET_: Responds with an array of all article objects with the required keys (author, title, article_id, topic, created_at, votes, article_img_url, comment_count) ordered from most recent.

  - Accepts a query of **topic** (_?topic=topic_name_) that responds with an array of article objects associated to that topic.
  - Accepts a query of **order** (\_?order=asc_desc) that responds with an array of article objects ordered by desc or asc order, defaulting to desc.
  - Accepts a query of **sort_by** (\_?sort_by=column_name) that responds with an array of article objects sorted by any column, defaulting to created_at.

- _POST_: Responds with the posted article object with the required keys (article_id, author, title, body, topic, article_img_url, votes, created_at, comment_count)

### /api/articles/:article_id

- _GET_: Responds with an article object with the required keys (author, title, article_id, body, topic, created_at, votes, article_imd_url, comment_count).

- _PATCH_: Responds with the patched article object and its updated votes property, along with the other required keys (author, title, article_id, topic, created_at, article_img_url).

### /api/articles/:article_id/comments

- _GET_: Responds with an array of all comment objects associated to the passed article id with the required keys (comment_id, votes, created_at, author, body, article_id) ordered from most recent.

- _POST_: Responds with the posted comment object associated to the passed article id and containing the required key-value pairs (comment_id, votes, created_at, author, body, article_id).

### /api/comments/:comment_id

- _DELETE_: Deletes the specified comment and sends a 204 and no body back.

- _PATCH_: Responds with the patched article object and its updated votes property, along with the other required keys (author, title, article_id, topic, created_at, article_img_url).

## Contributions

This project is open to contributions. Feel free to submit a pull request if you would like to make a suggestion or raise an issue or problem with the code.

## Final note

This project was developed
