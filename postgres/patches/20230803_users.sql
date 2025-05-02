\connect dstk;

CREATE SCHEMA dstk_user;

CREATE TABLE dstk_user.user (
    id                 TEXT        NOT NULL PRIMARY KEY,
    user_id            VARCHAR(16) NOT NULL DEFAULT generate_monogram('USR') UNIQUE,
    real_name          TEXT        NOT NULL,
    email              TEXT        NOT NULL,
    is_email_verified  BOOLEAN     NOT NULL DEFAULT FALSE,
    is_mfa_enrolled    BOOLEAN     NOT NULL DEFAULT FALSE,
    image              TEXT,
    user_name          TEXT        NOT NULL,
    date_created       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.sessions (
     id                     TEXT      NOT NULL PRIMARY KEY,
     user_id                TEXT      NOT NULL REFERENCES dstk_user.user(id),
     token                  TEXT      NOT NULL,
     ip_address             TEXT,
     user_agent             TEXT,
     expires_at             TIMESTAMP NOT NULL,
     date_created           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
     date_modified          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.accounts (
     id                      TEXT       NOT NULL PRIMARY KEY,
     account_id              TEXT       NOT NULL,
     provider_id             TEXT       NOT NULL,
     user_id                 TEXT       NOT NULL REFERENCES dstk_user.user(id),
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
     id              TEXT      NOT NULL PRIMARY KEY,
     identifier      TEXT      NOT NULL,
     value           TEXT      NOT NULL,
     expires_at      TIMESTAMP NOT NULL,
     date_created    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
     date_modified   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
