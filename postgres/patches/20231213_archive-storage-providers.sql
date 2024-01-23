\connect dstk;

BEGIN;

ALTER TABLE registry.storage_providers
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;

COMMIT;
