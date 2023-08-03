\connect dstk_registry;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE registry_models (
    id               SERIAL  NOT NULL PRIMARY KEY,
    dstk_id          UUID    NOT NULL DEFAULT uuid_generate_v4(),
    description      TEXT,
    metadata         JSON,
    is_archived      BOOLEAN NOT NULL DEFAULT FALSE,
    created_by       UUID, -- TODO: make non-nullable
    storage_provider UUID  -- TODO: make non-nullable
);