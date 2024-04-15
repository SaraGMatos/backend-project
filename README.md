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

## /api/topics

- _GET_: Responds with an array of objects with all topics and the required keys (slug, description).

## /api/articles

- _GET_: Responds with an array of objects with all articles in descending order by creation date and with the required keys (author, title, article_id, topic, created_at, votes, article_img_url, comment_count).

## /api/treasures/:treasure_id

- _GET_: Responds with an article object with the required keys (author, title, article_id, body, topic, created_at, votes, article_imd_url).
