CREATE VIEW masjid_uq FROM
(
    SELECT * FROM masjids WHERE masjid.updated_at = (
        SELECT MAX(im.updated_at) FROM masjids im GROUP BY im.name
    )
)
