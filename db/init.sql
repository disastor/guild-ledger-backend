CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  class VARCHAR(50) NOT NULL,
  role VARCHAR(50) NOT NULL,
  bio TEXT,
  avatar_seed VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  result VARCHAR(10) NOT NULL, -- 'win' or 'loss'
  notes TEXT,
  played_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO characters (name, class, role, bio, avatar_seed) VALUES
  ('Brennic Stormward', 'Vanguard', 'Top', 'Never met a shield bash he didn''t like.', 'brennic'),
  ('Aelis Nightbloom', 'Shadowblade', 'Jungle', 'Ganks first, asks questions never.', 'aelis'),
  ('Torvin Quickfuse', 'Artificer', 'Mid', 'Blames the ping, never the build.', 'torvin')
ON CONFLICT DO NOTHING;

INSERT INTO matches (character_id, result, notes) VALUES
  (1, 'win', 'Solid teamfight, peeled for the carry.'),
  (1, 'loss', 'Got caught overextending.'),
  (2, 'win', 'Triple kill from behind the fog.'),
  (3, 'loss', 'Roamed too early, lost mid tempo.')
ON CONFLICT DO NOTHING;
