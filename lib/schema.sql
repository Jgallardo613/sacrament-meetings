-- Sacrament Meeting Planner — schema + seed data (W03)
--
-- Run this once against your Neon database, e.g. paste it into the
-- Neon SQL Editor, or:   psql "$DATABASE_URL" -f lib/schema.sql
--
-- SAMPLE DATA: every row below is fictional, hand-written seed data for
-- development. The names, hymn choices, and announcements are placeholders,
-- not a real ward's records.
--
-- Re-running this file drops and recreates the table (seed data is reset).

DROP TABLE IF EXISTS speakers;
DROP TABLE IF EXISTS meetings;

CREATE TABLE meetings (
  id                    SERIAL PRIMARY KEY,
  meeting_date          DATE        NOT NULL UNIQUE,
  meeting_type          TEXT        NOT NULL
                        CHECK (meeting_type IN ('regular', 'testimony', 'stake', 'general')),
  presiding             TEXT        NOT NULL,
  conducting            TEXT        NOT NULL,
  announcements         JSONB       NOT NULL DEFAULT '[]'::jsonb,  -- string[]
  opening_hymn_number   INTEGER     NOT NULL,
  opening_hymn_title    TEXT        NOT NULL,
  opening_prayer        TEXT        NOT NULL,
  ward_business         JSONB       NOT NULL DEFAULT '[]'::jsonb,  -- { description }[]
  stake_business        BOOLEAN     NOT NULL DEFAULT FALSE,
  sacrament_hymn_number INTEGER     NOT NULL,
  sacrament_hymn_title  TEXT        NOT NULL,
  closing_hymn_number   INTEGER     NOT NULL,
  closing_hymn_title    TEXT        NOT NULL,
  closing_prayer        TEXT        NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX meetings_meeting_date_idx ON meetings (meeting_date DESC);

-- Speakers and musical numbers on each meeting's program, in order.
CREATE TABLE speakers (
  id          SERIAL PRIMARY KEY,
  meeting_id  INTEGER NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  name        TEXT    NOT NULL,
  topic       TEXT    NOT NULL,
  type        TEXT    NOT NULL DEFAULT 'speaker'
              CHECK (type IN ('speaker', 'musical-number')),
  UNIQUE (meeting_id, position)
);

CREATE INDEX speakers_meeting_id_idx ON speakers (meeting_id);

INSERT INTO meetings (
  meeting_date, meeting_type, presiding, conducting, announcements,
  opening_hymn_number, opening_hymn_title, opening_prayer,
  ward_business, stake_business,
  sacrament_hymn_number, sacrament_hymn_title,
  closing_hymn_number, closing_hymn_title, closing_prayer
) VALUES
(
  '2026-10-05', 'general', 'Bishop Thomas Hale', 'First Counselor Mark Jensen', '[]',
  1, 'The Morning Breaks', 'Angela Scott',
  '[]', FALSE,
  174, 'Again We Meet Around the Board',
  341, 'Let Zion in Her Beauty Rise', 'Daniel White'
),
(
  '2026-10-12', 'stake', 'President Alan Brooks', 'President Alan Brooks',
  '["Stake conference next month — save November 22-23."]',
  262, 'Go Forth with Faith', 'Julia Morris',
  '[]', TRUE,
  170, 'God, Our Father, Hear Us Pray',
  30, 'Come, Come, Ye Saints', 'Nathan Price'
),
(
  '2026-10-19', 'regular', 'Bishop Thomas Hale', 'Bishop Thomas Hale',
  '["Service project at the food bank next Saturday, 9am–noon.",
    "Youth temple trip November 1st — permission slips due Friday."]',
  243, 'Let Us All Press On', 'Rebecca Ford',
  '[{"description":"Release of Elders Quorum President: Brother Steven Hall"},
    {"description":"Sustaining of new Elders Quorum President: Brother Jason Kimball"}]', TRUE,
  172, 'In Humility, Our Savior',
  272, 'Oh Say, What Is Truth?', 'Carlos Rivera'
),
(
  '2026-10-26', 'testimony', 'Bishop Thomas Hale', 'Second Counselor Paul Nguyen',
  '["Fast Sunday offerings can be submitted online this month."]',
  19, 'We Thank Thee, O God, for a Prophet', 'Amy Chen',
  '[]', FALSE,
  173, 'While of These Emblems We Partake',
  29, 'A Poor Wayfaring Man of Grief', 'Mike Torres'
),
(
  '2026-11-02', 'regular', 'Bishop Thomas Hale', 'First Counselor Mark Jensen',
  '["Ward temple trip scheduled for November 15th.",
    "Primary program rehearsal this Saturday at 10am."]',
  2, 'The Spirit of God', 'Sarah Williams',
  '[{"description":"Sustaining of new Primary president: Sister Rachel Torres"}]', FALSE,
  169, 'Again, Our Dear Redeeming Lord',
  85, 'How Firm a Foundation', 'David Olsen'
),
(
  '2026-11-09', 'regular', 'Bishop Thomas Hale', 'Second Counselor Paul Nguyen',
  '["Thanksgiving food drive boxes are in the foyer."]',
  92, 'For the Beauty of the Earth', 'Hannah Lee',
  '[{"description":"Sustaining of new ward clerk: Brother Omar Haddad"}]', FALSE,
  181, 'Jesus of Nazareth, Savior and King',
  94, 'Come, Ye Thankful People', 'Ethan Brooks'
),
(
  '2026-11-16', 'regular', 'Bishop Thomas Hale', 'Bishop Thomas Hale',
  '["Ward Christmas party December 12th — sign-up sheet in the foyer."]',
  136, 'I Know That My Redeemer Lives', 'Grace Kim',
  '[]', FALSE,
  191, 'Behold the Great Redeemer Die',
  98, 'I Need Thee Every Hour', 'Isaac Romero'
),
(
  '2026-11-23', 'stake', 'President Alan Brooks', 'First Counselor Diane Walsh',
  '["Stake conference broadcast at the stake center at 10am."]',
  6, 'Redeemer of Israel', 'Kevin Tran',
  '[]', TRUE,
  193, 'I Stand All Amazed',
  3, 'Now Let Us Rejoice', 'Lucy Bennett'
),
(
  '2026-11-30', 'regular', 'Bishop Thomas Hale', 'First Counselor Mark Jensen',
  '["Missionary farewell for Elder Noah Fisher next Sunday."]',
  223, 'Have I Done Any Good?', 'Olivia Carter',
  '[{"description":"Release of Young Women president: Sister Jenna Moss"}]', FALSE,
  175, 'O God, the Eternal Father',
  270, 'I''ll Go Where You Want Me to Go', 'Ben Whitaker'
),
(
  '2026-12-07', 'testimony', 'Bishop Thomas Hale', 'Second Counselor Paul Nguyen',
  '["Fast offering envelopes are available from the deacons."]',
  201, 'Joy to the World', 'Rosa Delgado',
  '[]', FALSE,
  184, 'Upon the Cross of Calvary',
  204, 'Silent Night', 'Victor Ng'
);

INSERT INTO speakers (meeting_id, position, name, topic, type) VALUES
  ((SELECT id FROM meetings WHERE meeting_date = '2026-10-05'), 1, 'General Conference Broadcast', 'General Conference Sunday', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-10-12'), 1, 'President Alan Brooks', 'Ministering in the Latter Days', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-10-12'), 2, 'Stake Choir', 'I Stand All Amazed', 'musical-number'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-10-19'), 1, 'Brother Jason Kimball', 'Covenant Keeping', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-10-19'), 2, 'Sister Lena Park', 'The Atonement of Jesus Christ', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-10-26'), 1, 'Open Testimony Meeting', 'Personal Testimonies', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-02'), 1, 'Elder James Park', 'Faith in Jesus Christ', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-02'), 2, 'Ward Choir', 'Come, Come Ye Saints', 'musical-number'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-02'), 3, 'Sister Carla Mendez', 'Strengthening Families', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-09'), 1, 'Brother Omar Haddad', 'Gratitude in All Things', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-09'), 2, 'Sister Priya Shah', 'Ministering Like the Savior', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-16'), 1, 'Sister Maria Gonzalez', 'The Power of the Book of Mormon', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-16'), 2, 'Youth Speaker Tyler Nash', 'Seminary and Daily Study', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-16'), 3, 'Hernandez Family', 'Families Can Be Together Forever', 'musical-number'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-23'), 1, 'Sister Diane Walsh', 'Gathering Israel', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-23'), 2, 'Elder Samuel Okafor', 'Repentance and Joy', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-30'), 1, 'Elder Noah Fisher', 'Preparing to Serve', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-11-30'), 2, 'Sister Jenna Moss', 'Light of Christ', 'speaker'),
  ((SELECT id FROM meetings WHERE meeting_date = '2026-12-07'), 1, 'Open Testimony Meeting', 'Personal Testimonies', 'speaker');
