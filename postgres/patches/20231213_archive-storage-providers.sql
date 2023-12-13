\connect dstk;

ALTER TABLE registry.storage_providers
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;