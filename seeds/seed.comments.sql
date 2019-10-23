INSERT INTO reframe_comments (mistake_id, comment, liked, disliked)
VALUES
    (1, 'That was crazy', 'true', 'false'),
    (2, 'That was crazy', 'false', 'true'),
    (3, 'That was crazy', 'true', 'false'),
    (4, 'That was crazy', 'true', 'false'),
    (5, 'That was crazy', 'true', 'false'),
    (6, 'That was crazy', 'true', 'false'),
    (7, 'That was crazy', 'true', 'false'),
    (8, 'That was crazy', 'true', 'false')


-- psql -U zachgw -d reframe-main -f ./seeds/seed.comments.sql