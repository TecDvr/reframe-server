INSERT INTO reframe_users (username, user_password, email)
VALUES
    ('demoUser', 'demoPassword', 'demo@gmail.com')

-- psql -U zachgw -d reframe-main -f ./seeds/seed.users.sql