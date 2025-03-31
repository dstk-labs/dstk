\connect dstk;

ALTER TABLE dstk_user.user
DROP COLUMN is_admin,
DROP COLUMN password,
ADD COLUMN banned      BOOLEAN,
ADD COLUMN ban_reason  TEXT,
ADD COLUMN ban_expires INTEGER,
ADD COLUMN email       TEXT NOT NULL,
ADD COLUMN image       TEXT,
ADD COLUMN role        TEXT;

UPDATE dstk_user.user
SET email = dstk_user.email.email_address
WHERE dstk_user.user.user_id = dstk_user.email.user_id
  AND dstk_user.email.is_primary = TRUE;

ALTER TABLE dstk_user.user
ALTER COLUMN email_address SET NOT NULL;

DROP TABLE dstk_user.email;
DROP TABLE dstk_user.refresh_token;
DROP TABLE dstk_user.api_key;

DROP TABLE dstk_user.team_edges;
DROP TABLE dstk_metadata.edge_relations;

CREATE TABLE dstk_user.sessions (
     id                     SERIAL      NOT NULL PRIMARY KEY,
     session_id             UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     expires_at             TIMESTAMP   NOT NULL,
     token                  TEXT        NOT NULL UNIQUE,
     ip_address             TEXT,
     user_agent             TEXT,
     user_id                VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
     impersonated_by        TEXT,
     active_organization_id TEXT,
     date_created           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
     date_modified          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.accounts (
     id                      SERIAL      NOT NULL PRIMARY KEY,
     account_id              UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     provider_id             UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     user_id                 VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
     access_token            TEXT,
     refresh_token           TEXT,
     id_token                TEXT,
     access_token_expires_at TIMESTAMP,
     scope                   TEXT,
     password                TEXT,
     date_created            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
     date_modified           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.verifications (
     id              SERIAL    NOT NULL PRIMARY KEY,
     verification_id UUID      NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     identifier      TEXT      NOT NULL,
     value           TEXT      NOT NULL,
     expires_at      TIMESTAMP NOT NULL,
     date_created    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
     date_modified   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.api_keys (
     id                     SERIAL      NOT NULL PRIMARY KEY,
     api_key_id             UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     name                   TEXT,
     start                  TEXT,
     prefix                 TEXT,
     key                    TEXT        NOT NULL,
     user_id                VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
     refill_interval        INTEGER,
     refill_amount          INTEGER,
     last_refill_at         TIMESTAMP,
     enabled                BOOLEAN,
     rate_limit_enabled     BOOLEAN,
     rate_limit_time_window INTEGER,
     rate_limit_max         INTEGER,
     request_count          INTEGER,
     remaining              INTEGER,
     last_request           TIMESTAMP,
     expires_at             TIMESTAMP,
     permissions            TEXT,
     metadata               TEXT,
     date_created           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
     date_modified          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.organizations (
     id              SERIAL    NOT NULL PRIMARY KEY,
     organization_id UUID      NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     name            TEXT      NOT NULL,
     slug            TEXT      NOT NULL UNIQUE,
     logo            TEXT,
     metadata        TEXT,
     date_created    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.members (
     id              SERIAL      NOT NULL PRIMARY KEY,
     member_id       UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     organization_id UUID        NOT NULL REFERENCES dstk_user.organizations(organization_id),
     user_id         VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
     role            TEXT        NOT NULL,
     teamid          TEXT,
     date_created    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.invitation (
     id              SERIAL      NOT NULL PRIMARY KEY,
     invitation_id   UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     organization_id UUID        NOT NULL REFERENCES dstk_user.organizations(organization_id),
     email           TEXT        NOT NULL,
     role            TEXT,
     teamid          TEXT,
     status          TEXT        NOT NULL,
     inviter_id      VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
     expires_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE dstk_user.teams
DROP COLUMN description,
DROP COLUMN is_archived,
DROP COLUMN created_by_id,
DROP COLUMN modified_by_id,
ADD COLUMN organization_id UUID NOT NULL REFERENCES dstk_user.organizations(organization_id);

CREATE TABLE dstk_user.two_factor (
     id            SERIAL  NOT NULL PRIMARY KEY,
     two_factor_id UUID    NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
     secret        TEXT    NOT NULL,
     backup_codes  TEXT    NOT NULL,
     user_id       VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id)
);
