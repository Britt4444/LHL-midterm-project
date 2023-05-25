DROP TABLE IF EXISTS music_eventsCASCADE;
CREATE TABLE music_events (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date date,
  end_date date,
  venue VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  postal_code VARCHAR(255) NOT NULL,
  event_link_url VARCHAR(255) NOT NULL,
  event_thumbnail VARCHAR(255) NOT NULL,
);
