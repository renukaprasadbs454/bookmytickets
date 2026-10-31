CREATE TABLE email_otps(challenge_hash text PRIMARY KEY,email text NOT NULL,code_hash text NOT NULL,attempts int NOT NULL DEFAULT 0,created_at timestamptz NOT NULL DEFAULT now(),expires_at timestamptz NOT NULL);
CREATE INDEX email_otps_email_created ON email_otps(email,created_at);
CREATE INDEX email_otps_expiry ON email_otps(expires_at);
