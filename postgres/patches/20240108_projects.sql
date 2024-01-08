\connect dstk;

CREATE TABLE dstk_user.projects (
    id             SERIAL      NOT NULL PRIMARY KEY,
    project_id     UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    team_id        UUID        NOT NULL REFERENCES dstk_user.teams(team_id),
    name           VARCHAR(64) NOT NULL,
    description    TEXT,
    is_archived    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_by_id  VARCHAR(16) REFERENCES dstk_user.user(user_id),
    modified_by_id VARCHAR(16) REFERENCES dstk_user.user(user_id),
    date_created   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
