\connect dstk;

ALTER TABLE registry.storage_providers
ADD COLUMN team_id UUID NOT NULL REFERENCES dstk_user.teams(team_id);