\connect dstk;

CREATE TABLE dstk_user.teams (
    id             SERIAL      NOT NULL PRIMARY KEY,
    team_id        UUID        NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    name           VARCHAR(64) NOT NULL,
    description    TEXT,
    is_archived    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_by_id  VARCHAR(16) REFERENCES dstk_user.user(user_id),
    modified_by_id VARCHAR(16) REFERENCES dstk_user.user(user_id),
    date_created   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_modified  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE dstk_metadata.edge_relations (
    id   SERIAL      NOT NULL PRIMARY KEY,
    type VARCHAR(12) NOT NULL
);

BEGIN;
INSERT INTO dstk_metadata.edge_relations (type)
VALUES
    ('owner'),
    ('member'),
    ('viewer');
COMMIT;

CREATE TABLE dstk_user.team_edges (
    id        BIGSERIAL   NOT NULL PRIMARY KEY,
    team_id   UUID        NOT NULL REFERENCES dstk_user.teams(team_id),
    edge_type INTEGER     NOT NULL REFERENCES dstk_metadata.edge_relations(id),
    user_id   VARCHAR(16) NOT NULL REFERENCES dstk_user.user(user_id),
    UNIQUE(user_id, team_id)
);

COMMENT ON TABLE dstk_user.team_edges is 'Edge type reflects user relation to team';
