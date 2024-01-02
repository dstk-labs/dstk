\connect dstk;

CREATE SCHEMA dstk_user;

CREATE TABLE dstk_user.user (
    id                SERIAL      NOT NULL PRIMARY KEY,
    user_id           VARCHAR(16) NOT NULL DEFAULT generate_monogram('USR') UNIQUE,
    is_admin          BOOLEAN     NOT NULL DEFAULT FALSE,
    is_approved       BOOLEAN     NOT NULL DEFAULT FALSE,
    is_disabled       BOOLEAN     NOT NULL DEFAULT FALSE,
    is_email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    is_mfa_enrolled   BOOLEAN     NOT NULL DEFAULT FALSE,
    real_name         TEXT        NOT NULL,
    user_name         TEXT        NOT NULL UNIQUE,
    date_created      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.email (
    id                SERIAL       NOT NULL PRIMARY KEY,
    email_id          UUID         NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id           VARCHAR(16)  NOT NULL REFERENCES dstk_user.user(user_id),
    email_address     VARCHAR(128) NOT NULL UNIQUE,
    is_verified       BOOLEAN      NOT NULL DEFAULT FALSE,
    is_primary        BOOLEAN      NOT NULL,
    verification_code VARCHAR(64),
    date_created      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_user.session (
    id              SERIAL      NOT NULL PRIMARY KEY,
    session_id      UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id         VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
    is_partial      BOOLEAN     NOT NULL,
    session_key     VARCHAR(64) NOT NULL,
    session_expires TIMESTAMP WITH TIME ZONE NOT NULL,
    sesstion_start  TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE dstk_user.log (
    id            SERIAL NOT NULL PRIMARY KEY,
    log_id        UUID   NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id       VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
    actor_id      VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
    session_id    UUID   NOT NULL REFERENCES dstk_user.session(session_id),
    old_value     TEXT   NOT NULL,
    new_value     TEXT   NOT NULL,
    remote_addr   INET   NOT NULL,
    details       TEXT   NOT NULL,
    user_action   TEXT   NOT NULL,
    date_created  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
