\connect dstk;

CREATE SCHEMA registry;

CREATE TABLE registry.storage_providers (
    id                SERIAL       NOT NULL PRIMARY KEY,
    provider_id       UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    endpoint_url      VARCHAR(512) NOT NULL,
    region            VARCHAR(32)  NOT NULL,
    bucket            VARCHAR(64)  NOT NULL,
    access_key_id     TEXT         NOT NULL,
    secret_access_key TEXT         NOT NULL,
    created_by        UUID         REFERENCES dstk_user.user(user_id),
    modified_by       UUID         REFERENCES dstk_user.user(user_id),
    owner             UUID         REFERENCES dstk_user.user(user_id),
    date_created      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE registry.models (
    id                  SERIAL      NOT NULL PRIMARY KEY,
    model_id            UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    storage_provider_id UUID        NOT NULL REFERENCES registry.storage_providers(provider_id),
    is_archived         BOOLEAN     NOT NULL DEFAULT FALSE,
    model_name          VARCHAR(64) NOT NULL,
    created_by          UUID        REFERENCES dstk_user.user(user_id),
    modified_by         UUID        REFERENCES dstk_user.user(user_id),
    description         TEXT,
    metadata            JSON,
    date_created        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE registry.model_versions (
    id               SERIAL  NOT NULL PRIMARY KEY,
    model_version_id UUID    NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    model_id         UUID    NOT NULL REFERENCES registry.models(model_id),
    is_finalized     BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived      BOOLEAN NOT NULL DEFAULT FALSE,
    created_by       UUID    REFERENCES dstk_user.user(user_id),
    numeric_version  INTEGER NOT NULL,
    description      TEXT,
    metadata         JSON,
    date_created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(model_id, numeric_version)
);