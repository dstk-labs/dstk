\connect dstk;

ALTER TABLE dstk_user.user
ADD COLUMN password TEXT NOT NULL;