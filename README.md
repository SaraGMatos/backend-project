# Northcoders News API

## Endpoints

### /api

- _GET_: Responds with a list of all the endpoints that can be interacted with.

### /api/users

- _GET_: Responds with an array of all user objects and the required keys (username, name, avatar_url).

### /api/topics

- _GET_: Responds with an array of all topic objects and the required keys (slug, description).

### /api/articles

- _GET_: Responds with an array of all article objects with the required keys (author, title, article_id, topic, created_at, votes, article_img_url, comment_count) ordered from most recent.
  - Also accepts a query of topic (_?topic=topic_name_) that responds with an array of article objects associated to that topic.

### /api/articles/:article_id

- _GET_: Responds with an article object with the required keys (author, title, article_id, body, topic, created_at, votes, article_imd_url, comment_count).

- _PATCH_: Responds with the patched article object and its updated votes property, along with the other required keys (author, title, article_id, topic, created_at, article_img_url).

### /api/articles/:article_id/comments

- _GET_: Responds with an array of all comment objects associated to the passed article id with the required keys (comment_id, votes, created_at, author, body, article_id) ordered from most recent.

- _POST_: Responds with the posted comment object associated to the passed article id and containing the required key-value pairs (comment_id, votes, created_at, author, body, article_id).

### /api/comments/:comment_id

- _DELETE_: Deletes the specified comment and sends a 204 and no body back.
