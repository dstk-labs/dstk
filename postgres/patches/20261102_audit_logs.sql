\connect dstk;

CREATE TYPE AUDIT_ACTION AS ENUM (
    'created',
    'edited',
    'archived',
    'unarchived',
    'published',
    'file_uploaded'
);

CREATE TYPE AUDIT_RESOURCE_TYPE AS ENUM (
    'project',
    'storage_provider',
    'model',
    'model_version'
);

CREATE TABLE dstk_user.audit_logs (
    id            SERIAL              NOT NULL PRIMARY KEY,
    team_id       VARCHAR(17)         NOT NULL REFERENCES dstk_user.teams(id),
    actor_id      VARCHAR(16)         REFERENCES dstk_user.users(id),
    action        AUDIT_ACTION        NOT NULL,
    resource_type AUDIT_RESOURCE_TYPE NOT NULL,
    resource_id   VARCHAR(32)         NOT NULL,
    resource_name TEXT                NOT NULL,
    details       JSON,
    date_created  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_team_date ON dstk_user.audit_logs(team_id, date_created DESC, id DESC);

INSERT INTO dstk_user.audit_logs (team_id, actor_id, action, resource_type, resource_id, resource_name, date_created)
SELECT team_id, created_by_id, 'created', 'project', project_id, name, date_created
FROM dstk_user.projects;

INSERT INTO dstk_user.audit_logs (team_id, actor_id, action, resource_type, resource_id, resource_name, date_created)
SELECT team_id, created_by_id, 'created', 'storage_provider', provider_id, bucket, date_created
FROM registry.storage_providers;

INSERT INTO dstk_user.audit_logs (team_id, actor_id, action, resource_type, resource_id, resource_name, date_created)
SELECT p.team_id, m.created_by_id, 'created', 'model', m.model_id, m.model_name, m.date_created
FROM registry.models m
JOIN dstk_user.projects p ON p.project_id = m.project_id;

INSERT INTO dstk_user.audit_logs (team_id, actor_id, action, resource_type, resource_id, resource_name, date_created)
SELECT p.team_id, v.created_by_id, 'created', 'model_version', v.model_version_id, m.model_name || ' v' || v.numeric_version, v.date_created
FROM registry.model_versions v
JOIN registry.models m ON m.model_id = v.model_id
JOIN dstk_user.projects p ON p.project_id = m.project_id;
