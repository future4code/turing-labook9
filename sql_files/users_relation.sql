SELECT * FROM users_relation; 

TRUNCATE TABLE users_relation;

CREATE TABLE users_relation (
	follower_id VARCHAR(255),
	user_to_follow_id VARCHAR(255),
	PRIMARY KEY (follower_id,user_to_follow_id)
);