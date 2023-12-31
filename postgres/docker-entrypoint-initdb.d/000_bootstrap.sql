CREATE DATABASE dstk;

\connect dstk;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA dstk_metadata;

CREATE TABLE dstk_metadata.patch_status (
    patch    VARCHAR(100) NOT NULL PRIMARY KEY,
    applied  BOOLEAN NOT NULL DEFAULT FALSE,
    duration INTEGER
);


CREATE FUNCTION generate_monogram(monogram varchar) RETURNS VARCHAR
    LANGUAGE SQL
    IMMUTABLE
    RETURNS NULL ON NULL INPUT
    RETURN CONCAT(
        monogram,
        '-',
        SUBSTRING(
            CAST(uuid_generate_v4() as VARCHAR(36))
            from 25 for 12
        )
    );