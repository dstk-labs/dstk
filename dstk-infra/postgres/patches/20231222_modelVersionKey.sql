\connect dstk;

ALTER TABLE registry.model_versions
ADD COLUMN s3_prefix TEXT;