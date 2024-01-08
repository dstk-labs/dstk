\connect dstk;

CREATE TYPE cursor_relations AS ENUM (
    'model',
    'model_version'
);

CREATE TABLE dstk_metadata.cursors (
    id                 SERIAL           NOT NULL PRIMARY KEY,
    cursor_id          UUID             NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    cursor_token       VARCHAR(128)     NOT NULL,
    cursor_relation    CURSOR_RELATIONS NOT NULL,
    expiration         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '5 minute',
    UNIQUE(cursor_token, cursor_relation)
);
