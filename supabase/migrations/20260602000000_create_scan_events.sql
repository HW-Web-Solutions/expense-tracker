-- Track scan API attempts for rate limiting
CREATE TABLE scan_events (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider      text,
  model         text,
  status        text        NOT NULL DEFAULT 'attempted', -- attempted | success | error
  file_type     text,
  file_size     bigint,
  error_message text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own scan events"
  ON scan_events FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for fast per-user rate limit queries
CREATE INDEX scan_events_user_created ON scan_events (user_id, created_at DESC);
