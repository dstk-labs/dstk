\connect dstk;

ALTER TABLE registry.models
ADD COLUMN current_model_version_id INTEGER
CONSTRAINT current_model_version_fk REFERENCES registry.model_versions(id);
