ALTER TABLE holds ADD COLUMN addons jsonb NOT NULL DEFAULT '[]';
ALTER TABLE holds ADD COLUMN coupon_id uuid REFERENCES resources(id);
ALTER TABLE holds ADD COLUMN discount_minor bigint NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX current_policy ON resources(kind) WHERE kind='policy' AND status='approved' AND deleted_at IS NULL;
CREATE INDEX active_holds ON holds(show_id,expires_at) WHERE status='active';
CREATE INDEX notification_pending ON notification_jobs(status,available_at);
