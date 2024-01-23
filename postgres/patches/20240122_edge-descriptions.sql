\connect dstk;

BEGIN;

ALTER TABLE dstk_metadata.edge_relations
ADD COLUMN description TEXT;

UPDATE dstk_metadata.edge_relations
SET description = 'User has administrative control over object and all child objects'
WHERE type = 'owner';

UPDATE dstk_metadata.edge_relations
SET description = 'User has read/write access to object and all child objects'
WHERE type = 'member';

UPDATE dstk_metadata.edge_relations
SET description = 'User has read-only access to object and most child objects'
WHERE type = 'viewer';

ALTER TABLE dstk_metadata.edge_relations
ALTER COLUMN description SET NOT NULL;

COMMIT;
