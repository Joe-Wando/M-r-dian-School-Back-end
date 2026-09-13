-- Add new nullable columns first (existing rows predate real file uploads)
ALTER TABLE "work_submissions" ADD COLUMN "original_file_name" TEXT;
ALTER TABLE "work_submissions" ADD COLUMN "stored_file_name" TEXT;
ALTER TABLE "work_submissions" ADD COLUMN "feedback" TEXT;
ALTER TABLE "work_submissions" ADD COLUMN "feedback_original_file_name" TEXT;
ALTER TABLE "work_submissions" ADD COLUMN "feedback_stored_file_name" TEXT;
ALTER TABLE "work_submissions" ADD COLUMN "reviewed_at" TIMESTAMP(3);

-- Backfill legacy rows (file_url held a fake filename/url, no real file on disk)
UPDATE "work_submissions"
SET "original_file_name" = "file_url",
    "stored_file_name" = 'legacy-' || "id"::text
WHERE "original_file_name" IS NULL;

-- Now that every row has a value, enforce NOT NULL
ALTER TABLE "work_submissions" ALTER COLUMN "original_file_name" SET NOT NULL;
ALTER TABLE "work_submissions" ALTER COLUMN "stored_file_name" SET NOT NULL;

-- Drop the legacy column
ALTER TABLE "work_submissions" DROP COLUMN "file_url";
