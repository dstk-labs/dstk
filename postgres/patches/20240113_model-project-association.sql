\connect dstk;

ALTER TABLE registry.models
ADD COLUMN project_id UUID NOT NULL REFERENCES dstk_user.projects(project_id);