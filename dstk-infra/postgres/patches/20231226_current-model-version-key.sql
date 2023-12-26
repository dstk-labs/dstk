\connect dstk;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE registry.models
ADD COLUMN current_model_version_id UUID
CONSTRAINT current_model_version_fk REFERENCES registry.model_versions(model_version_id);
