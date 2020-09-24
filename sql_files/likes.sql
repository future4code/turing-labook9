SELECT * FROM likes;

CREATE TABLE likes (
	user_like_id VARCHAR(255),
	post_to_like_id VARCHAR(255),
	PRIMARY KEY ( user_like_id, post_to_like_id )
);