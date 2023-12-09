\connect dstk

CREATE SCHEMA metadata;

CREATE TABLE metadata.patch_status (
    patch    VARCHAR(100) NOT NULL PRIMARY KEY,
    applied  BOOLEAN NOT NULL DEFAULT FALSE,
    duration INTEGER
);
