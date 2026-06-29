-- Christmas in July — RSVP table
-- Runs automatically on first submission, but here it is for manual setup
-- (paste into the Neon SQL editor if you'd rather create it yourself).

CREATE TABLE IF NOT EXISTS rsvp (
  id           SERIAL PRIMARY KEY,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  address      TEXT NOT NULL,
  bringing     TEXT NOT NULL,
  notes        TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Handy views for checking submissions in the Neon console:
-- SELECT count(*) FROM rsvp;
-- SELECT first_name, last_name, bringing, submitted_at FROM rsvp ORDER BY submitted_at DESC;
