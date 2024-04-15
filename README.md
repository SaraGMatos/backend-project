# Northcoders News API

Northcoders News is a RESTful API that allows users to interact and access data from our News database.

# Set up

In order to run this project locally you will need to create the development and test environment variables.

To do so please:

    1. Install `dotenv`
    2. Add an `.env.development` file to the project root and set the development environment variable of PGDATABASE (you can find its name in the `setup.sql` file).
    3. Add an `.end.test` file to the project root and set the test environment variable of PGDATABASE (you can find its name in the `setup.sql` file).
    4. Add these two files to .gitignore.
