\connect dstk;

CREATE SCHEMA metadata;

CREATE TABLE metadata.model_cursors (
    id           SERIAL      NOT NULL PRIMARY KEY,
    cursor_id    UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    cursor_token VARCHAR(12) NOT NULL,
    result_id    BIGINT      NOT NULL UNIQUE REFERENCES registry.models(id),
    expiration   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '5 minute'
);
