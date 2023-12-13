\connect dstk;

CREATE SCHEMA dstk_metadata;

CREATE TABLE dstk_metadata.patch_status (
    patch    VARCHAR(100) NOT NULL PRIMARY KEY,
    applied  BOOLEAN NOT NULL DEFAULT FALSE,
    duration INTEGER
);
