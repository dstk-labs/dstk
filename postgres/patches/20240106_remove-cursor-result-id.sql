\connect dstk;

ALTER TABLE dstk_metadata.cursors DROP COLUMN result_id;

ALTER TABLE dstk_metadata.cursors
ALTER COLUMN cursor_token TYPE VARCHAR(128);
