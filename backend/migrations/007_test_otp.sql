ALTER TABLE email_otps ADD COLUMN test_mode boolean NOT NULL DEFAULT false;
ALTER TABLE sessions ADD COLUMN test_mode boolean NOT NULL DEFAULT false;
