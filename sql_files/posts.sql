SET SQL_SAFE_UPDATES = 0;
DELETE FROM posts WHERE id = "45d9314b-fa9d-45d2-b50b-780511715440";
TRUNCATE TABLE posts;
DROP TABLE posts;

DESCRIBE posts;

SELECT * from posts;

CREATE TABLE posts (
	post_id VARCHAR(255) NOT NULL PRIMARY KEY,
    post_photo VARCHAR(255) NOT NULL,
    post_description text NOT NULL,
    post_createdAt datetime NOT NULL,
    post_type VARCHAR(255) DEFAULT "normal",
    post_userId VARCHAR(255),
    FOREIGN KEY (post_userId) REFERENCES users_labook(id)
);