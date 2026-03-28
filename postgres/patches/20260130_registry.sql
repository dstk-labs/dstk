\connect dstk;

CREATE SCHEMA registry;

CREATE TABLE registry.storage_providers (
    id                SERIAL        NOT NULL PRIMARY KEY,
    provider_id       VARCHAR(15)   NOT NULL DEFAULT generate_monogram('SP') UNIQUE,
    endpoint_url      VARCHAR(512)  NOT NULL,
    region            VARCHAR(32)   NOT NULL,
    bucket            VARCHAR(64)   NOT NULL,
    access_key_id     TEXT          NOT NULL,
    secret_access_key TEXT          NOT NULL,
    created_by_id     VARCHAR(16)   NOT NULL REFERENCES dstk_user.users(id),
    modified_by_id    VARCHAR(16)   NOT NULL REFERENCES dstk_user.users(id),
    owner_id          VARCHAR(16)   NOT NULL REFERENCES dstk_user.users(id),
    is_archived       BOOLEAN       NOT NULL DEFAULT FALSE,
    team_id           VARCHAR(17)   NOT NULL REFERENCES dstk_user.teams(id),
    date_created      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    date_modified     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE registry.models (
    id                       SERIAL       NOT NULL PRIMARY KEY,
    model_id                 VARCHAR(16)  NOT NULL DEFAULT generate_monogram('MDL') UNIQUE,
    storage_provider_id      VARCHAR(15)  NOT NULL REFERENCES registry.storage_providers(provider_id),
    is_archived              BOOLEAN      NOT NULL DEFAULT FALSE,
    model_name               VARCHAR(64)  NOT NULL,
    created_by_id            VARCHAR(16)  REFERENCES dstk_user.users(id),
    modified_by_id           VARCHAR(16)  REFERENCES dstk_user.users(id),
    description              TEXT,
    metadata                 JSON,
    project_id               VARCHAR(17)  NOT NULL REFERENCES dstk_user.projects(project_id),
    date_created             TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    date_modified            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE registry.model_versions (
    id               SERIAL      NOT NULL PRIMARY KEY,
    model_version_id VARCHAR(17) NOT NULL DEFAULT generate_monogram('MDLV') UNIQUE,
    model_id         VARCHAR(16) NOT NULL REFERENCES registry.models(model_id),
    is_finalized     BOOLEAN     NOT NULL DEFAULT FALSE,
    is_archived      BOOLEAN     NOT NULL DEFAULT FALSE,
    created_by_id    VARCHAR(16) REFERENCES dstk_user.users(id),
    modified_by_id   VARCHAR(16) REFERENCES dstk_user.users(id),
    numeric_version  INTEGER     NOT NULL,
    s3_prefix        TEXT        NOT NULL,
    description      TEXT,
    metadata         JSON,
    date_created     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modified    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(model_id, numeric_version)
);

ALTER TABLE registry.models
ADD COLUMN current_model_version_id VARCHAR(17)
CONSTRAINT current_model_version_fk REFERENCES registry.model_versions(model_version_id);
