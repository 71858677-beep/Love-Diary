-- ============================================================
-- Love Diary — Supabase Database Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Tables ──

CREATE TABLE fragments (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE habits (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE footprints (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bucket_items (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE love_letters (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE care_records (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE dashboard_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──
-- Since we use a shared account, all authenticated users get full access

ALTER TABLE fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE footprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_access_fragments" ON fragments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_access_habits" ON habits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_access_footprints" ON footprints FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_access_bucket" ON bucket_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_access_letters" ON love_letters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_access_care" ON care_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_access_settings" ON dashboard_settings FOR ALL USING (true) WITH CHECK (true);
