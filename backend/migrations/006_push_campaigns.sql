ALTER TABLE consent_records ADD COLUMN marketing_push boolean NOT NULL DEFAULT false;
CREATE TABLE push_devices (
 id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id), token_hash text NOT NULL UNIQUE,
 token_cipher text NOT NULL, platform text NOT NULL CHECK(platform='android'),
 enabled boolean NOT NULL DEFAULT true, city_id uuid REFERENCES resources(id),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX push_devices_user ON push_devices(user_id) WHERE enabled;
CREATE TABLE push_campaigns (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_by uuid NOT NULL REFERENCES users(id),
 title text NOT NULL, body text NOT NULL, audience text NOT NULL CHECK(audience IN ('all','city','favourites','booked')),
 audience_id uuid REFERENCES resources(id), destination text NOT NULL CHECK(destination IN ('home','content','venue','bookings')),
 destination_id uuid REFERENCES resources(id), scheduled_at timestamptz NOT NULL DEFAULT now(),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','queued','sending','completed','cancelled','failed')),
 created_at timestamptz NOT NULL DEFAULT now(), started_at timestamptz, completed_at timestamptz,
 recipient_count int NOT NULL DEFAULT 0, failure text
);
CREATE INDEX push_campaigns_due ON push_campaigns(scheduled_at) WHERE status='queued';
CREATE TABLE customer_notifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), campaign_id uuid NOT NULL REFERENCES push_campaigns(id),
 user_id uuid NOT NULL REFERENCES users(id), title text NOT NULL, body text NOT NULL,
 data jsonb NOT NULL, read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(campaign_id,user_id)
);
CREATE INDEX customer_notifications_user ON customer_notifications(user_id,created_at DESC);
CREATE TABLE push_deliveries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), campaign_id uuid NOT NULL REFERENCES push_campaigns(id),
 notification_id uuid NOT NULL REFERENCES customer_notifications(id), device_id uuid NOT NULL REFERENCES push_devices(id),
 user_id uuid NOT NULL REFERENCES users(id), status text NOT NULL DEFAULT 'queued'
 CHECK(status IN ('queued','processing','accepted','failed','skipped','unknown')),
 attempts int NOT NULL DEFAULT 0, available_at timestamptz NOT NULL DEFAULT now(), locked_at timestamptz,
 result text, provider_message_id text, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(campaign_id,device_id)
);
CREATE INDEX push_deliveries_due ON push_deliveries(available_at) WHERE status='queued';
