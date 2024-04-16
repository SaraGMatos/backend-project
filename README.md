# Northcoders News API

Northcoders News is a RESTful API that allows users to interact and access data from our News database.

# Set up

In order to run this project locally you will need to create the development and test environment variables.

To do so please:

    1. Install `dotenv`
    2. Add an `.env.development` file to the project root and set the development environment variable of PGDATABASE (you can find its name in the `setup.sql` file).
    3. Add an `.end.test` file to the project root and set the test environment variable of PGDATABASE (you can find its name in the `setup.sql` file).
    4. Add these two files to .gitignore.

# Endpoints

## /api

- _GET_: Responds with a list of all the endpoints that can be interacted with.

## /api/users

- _GET_: Responds with an array of objects with all users and the required keys (username, name, avatar_url).

## /api/topics

- _GET_: Responds with an array of objects with all topics and the required keys (slug, description).

## /api/articles

- _GET_: Responds with an array of objects with all articles in descending order by creation date and with the required keys (author, title, article_id, topic, created_at, votes, article_img_url, comment_count) ordered from most recent.

## /api/articles/:article_id

- _GET_: Responds with an article object with the required keys (author, title, article_id, body, topic, created_at, votes, article_imd_url).

- _PATCH_: Responds with the required article object and its updated votes property, along with the other required keys (author, title, article_id, topic, created_at, article_img_url).

## /api/articles/:article_id/comments

- _GET_: Responds with an array with all comment objects of a particular article with the required key-value pairs (comment_id, votes, created_at, author, body, article_id) ordered from most recent.

- _POST_: Responds with the posted comment object associated with the passed id and containing the required key-value pairs (comment_id, votes, created_at, author, body, article_id).

## /api/comments/:comment_id

- _DELETE_: Deletes the specified comment and sends a 204 and no body back.
