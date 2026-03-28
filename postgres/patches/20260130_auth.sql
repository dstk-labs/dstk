\connect dstk;

CREATE SCHEMA dstk_user;

/* Better Auth does not have a way to change the foreign key relationships with tables.

   These tables use UUID/monogram IDs as primary keys directly (no serial IDs),
   since the public facing keys are easier to read for clients.
*/

CREATE TABLE dstk_user.users (
    id                    VARCHAR(16)  NOT NULL DEFAULT generate_monogram('USR') PRIMARY KEY,
    real_name             TEXT         NOT NULL,
    email                 TEXT         NOT NULL,
    is_email_verified     BOOLEAN      NOT NULL DEFAULT FALSE,
    is_two_factor_enabled BOOLEAN      NOT NULL DEFAULT FALSE,
    image                 TEXT,
    user_name             TEXT         NOT NULL,
    date_created          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    date_modified         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON dstk_user.users(email);

-- This maps to better-auth organizations
CREATE TABLE dstk_user.teams (
    id             VARCHAR(17) NOT NULL DEFAULT generate_monogram('TEAM') PRIMARY KEY,
    name           TEXT        NOT NULL,
    description    TEXT,
    slug           TEXT        NOT NULL,
    logo           TEXT,
    metadata       TEXT,
    is_archived    BOOLEAN     NOT NULL,
    created_by_id  VARCHAR(16) NOT NULL REFERENCES dstk_user.users(id),
    modified_by_id VARCHAR(16) NOT NULL REFERENCES dstk_user.users(id),
    date_created   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modified  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_teams_slug ON dstk_user.teams(slug);

CREATE TYPE DSTK_ROLE AS ENUM ('owner', 'member', 'viewer');

CREATE TABLE dstk_user.members (
    id            UUID        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id       VARCHAR(16) NOT NULL REFERENCES dstk_user.users(id),
    team_id       VARCHAR(17) NOT NULL REFERENCES dstk_user.teams(id),
    role          DSTK_ROLE   NOT NULL,
    date_created  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modified TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_members_user_id ON dstk_user.members(user_id);
CREATE INDEX idx_members_team_id ON dstk_user.members(team_id);

CREATE TABLE dstk_user.projects (
    id                         SERIAL NOT NULL PRIMARY KEY,
    project_id                 VARCHAR(17) NOT NULL DEFAULT generate_monogram('PROJ') UNIQUE,
    name           TEXT        NOT NULL,
    description    TEXT,
    team_id        VARCHAR(17) NOT NULL REFERENCES dstk_user.teams(id),
    is_archived    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_by_id  VARCHAR(16) REFERENCES dstk_user.users(id),
    modified_by_id VARCHAR(16) REFERENCES dstk_user.users(id),
    date_created   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modified  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.sessions (
    id             UUID        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id        VARCHAR(16) NOT NULL REFERENCES dstk_user.users(id),
    token          TEXT        NOT NULL,
    ip_address     TEXT,
    user_agent     TEXT,
    active_team_id VARCHAR(17) REFERENCES dstk_user.teams(id),
    expires_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_created   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modified  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sessions_user_id ON dstk_user.sessions(user_id);
CREATE INDEX idx_sessions_token ON dstk_user.sessions(token);

CREATE TABLE dstk_user.accounts (
    id                       UUID        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    better_auth_account_id   TEXT        NOT NULL,
    user_id                  VARCHAR(16) NOT NULL REFERENCES dstk_user.users(id),
    provider_id              TEXT        NOT NULL,
    access_token             TEXT,
    refresh_token            TEXT,
    access_token_expires_at  TIMESTAMPTZ DEFAULT NOW(),
    refresh_token_expires_at TIMESTAMPTZ DEFAULT NOW(),
    scope                    TEXT,
    id_token                 TEXT,
    password                 TEXT,
    date_created             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modified            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_accounts_user_id ON dstk_user.accounts(user_id);

CREATE TABLE dstk_user.verifications (
    id            UUID        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    identifier    TEXT        NOT NULL,
    value         TEXT        NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_created  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modified TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_verifications_identifier ON dstk_user.verifications(identifier);

CREATE TABLE dstk_user.invitations (
    id            UUID        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    email         TEXT        NOT NULL,
    inviter_id    VARCHAR(16) NOT NULL REFERENCES dstk_user.users(id),
    team_id       VARCHAR(17) NOT NULL REFERENCES dstk_user.teams(id),
    role          DSTK_ROLE   NOT NULL,
    status        TEXT,
    expires_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_created  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modified TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_invitations_email ON dstk_user.invitations(email);
CREATE INDEX idx_invitations_team_id ON dstk_user.invitations(team_id);

-- Not using the better auth version of this table
CREATE TABLE dstk_user.api_key (
    id           SERIAL      NOT NULL PRIMARY KEY,
    api_key_id   UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id      VARCHAR(16) NOT NULL REFERENCES dstk_user.users(id),
    api_key      VARCHAR(32) NOT NULL UNIQUE,
    is_archived  BOOLEAN     NOT NULL DEFAULT FALSE,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.two_factors (
    id            UUID        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id       VARCHAR(16) NOT NULL REFERENCES dstk_user.users(id),
    secret        TEXT,
    backup_codes  TEXT
);

-- TODO: Device Authorization
-- TODO: Have I Been Pwned
-- TODO: Last Login Method
-- TODO: Polar / Stripe / Billing Engine Stuff
