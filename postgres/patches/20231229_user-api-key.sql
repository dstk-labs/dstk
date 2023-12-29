\connect dstk;

CREATE TABLE dstk_user.api_key (
    id           SERIAL      NOT NULL PRIMARY KEY,
    api_key_id   UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    user_id      UUID        NOT NULL REFERENCES dstk_user.user(user_id),
    api_key      VARCHAR(32) NOT NULL UNIQUE,
    is_archived  BOOLEAN     NOT NULL DEFAULT FALSE,
    date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);