DELETE FROM comments;
DELETE FROM posts;
DELETE FROM categories;

ALTER TABLE posts DROP COLUMN comments;
