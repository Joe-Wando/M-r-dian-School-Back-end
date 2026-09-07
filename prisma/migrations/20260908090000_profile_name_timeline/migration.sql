-- Ajoute name / headline / timeline au profil de vitrine.

ALTER TABLE "profile" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "profile" ADD COLUMN "headline" TEXT NOT NULL DEFAULT '';
ALTER TABLE "profile" ADD COLUMN "timeline" JSONB NOT NULL DEFAULT '[]';
