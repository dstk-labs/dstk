\connect dstk_metadata
CREATE TABLE patch_status (
    patch    VARCHAR(100) NOT NULL PRIMARY KEY,
    applied  BOOLEAN NOT NULL DEFAULT FALSE,
    duration INTEGER
);