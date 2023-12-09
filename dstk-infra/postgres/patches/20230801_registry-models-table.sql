\connect dstk;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA registry;

CREATE TABLE registry.storage_providers (
    id                SERIAL       NOT NULL PRIMARY KEY,
    provider_id       UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    endpoint_url      VARCHAR(512) NOT NULL,
    region            VARCHAR(32)  NOT NULL,
    bucket            VARCHAR(64)  NOT NULL,
    access_key_id     VARCHAR(128) NOT NULL,
    secret_access_key VARCHAR(40)  NOT NULL,
    created_by        UUID         NOT NULL,
    modified_by       UUID         NOT NULL,
    owner             UUID         NOT NULL,
    date_created      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE registry.models (
    id                  SERIAL      NOT NULL PRIMARY KEY,
    model_id            UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    storage_provider_id UUID        NOT NULL REFERENCES registry.storage_providers(provider_id),
    is_archived         BOOLEAN     NOT NULL DEFAULT FALSE,
    model_name          VARCHAR(64) NOT NULL UNIQUE,
    created_by          UUID        NOT NULL,
    modified_by         UUID        NOT NULL,
    description         TEXT,
    metadata            JSON,
    date_created        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE registry.model_versions (
    id               SERIAL  NOT NULL PRIMARY KEY,
    model_version_id UUID    NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    model_id         UUID    NOT NULL REFERENCES registry.models(model_id),
    is_archived      BOOLEAN NOT NULL DEFAULT FALSE,
    created_by       UUID    NOT NULL,
    numeric_version  INTEGER NOT NULL,
    description      TEXT,
    metadata         JSON,
    date_created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);