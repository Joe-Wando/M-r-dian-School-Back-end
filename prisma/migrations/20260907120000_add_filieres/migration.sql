-- Ajoute la table `filieres` (contenu éditorial des bandeaux du catalogue).
-- N'affecte aucune table existante.

-- CreateTable
CREATE TABLE "filieres" (
    "id" UUID NOT NULL,
    "category" "CourseCategory" NOT NULL,
    "intro" TEXT NOT NULL DEFAULT '',
    "video_url" TEXT,
    "levels" JSONB NOT NULL DEFAULT '{}',
    "certification_text" TEXT,
    "certification_url" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filieres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filieres_category_key" ON "filieres"("category");
