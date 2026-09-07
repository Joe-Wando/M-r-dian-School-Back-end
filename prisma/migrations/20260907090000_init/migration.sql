-- Migration initiale — schéma complet de la plateforme Meredian.
-- Générée à partir de prisma/schema.prisma (conventions Prisma / PostgreSQL).
-- Appliquer avec `prisma migrate deploy` (ou `prisma migrate dev`).

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');
CREATE TYPE "CourseCategory" AS ENUM ('Histoire', 'Droit', 'Informatique', 'RH');
CREATE TYPE "CourseLevel" AS ENUM ('L1', 'L2', 'L3', 'Formation Pro');
CREATE TYPE "CourseTemplate" AS ENUM ('Théorique illustré', 'Pratique guidée', 'Mixte');
CREATE TYPE "SectionType" AS ENUM ('reading', 'image', 'video', 'quiz');
CREATE TYPE "PaymentItemType" AS ENUM ('course', 'mentoring', 'correction');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'confirmed', 'failed');
CREATE TYPE "MentoringStatus" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE "WorkSubmissionStatus" AS ENUM ('pending', 'in_review', 'completed');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "CourseCategory" NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "template" "CourseTemplate" NOT NULL DEFAULT 'Mixte',
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "pdf_resource_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "modules" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sections" (
    "id" UUID NOT NULL,
    "module_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT NOT NULL DEFAULT '',
    "practical" BOOLEAN NOT NULL DEFAULT false,
    "body" TEXT,
    "video_url" TEXT,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "section_photos" (
    "id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL DEFAULT '',
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "section_photos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quiz_questions" (
    "id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_index" INTEGER NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "enrollments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "section_completions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "section_completions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "item_type" "PaymentItemType" NOT NULL,
    "item_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "naboopay_reference" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "mentoring_bookings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "meeting_link" TEXT,
    "status" "MentoringStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "mentoring_bookings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "qa_sessions" (
    "id" UUID NOT NULL,
    "topic" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "max_spots" INTEGER NOT NULL,

    CONSTRAINT "qa_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "qa_registrations" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "qa_registrations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_submissions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "status" "WorkSubmissionStatus" NOT NULL DEFAULT 'pending',
    "price" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_submissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "profile" (
    "id" UUID NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "cv_url" TEXT NOT NULL DEFAULT '',
    "pitch_video_url" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "email_contact" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "works" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "link" TEXT,

    CONSTRAINT "works_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "contact_messages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");
CREATE INDEX "courses_category_level_idx" ON "courses"("category", "level");
CREATE INDEX "modules_course_id_idx" ON "modules"("course_id");
CREATE INDEX "sections_module_id_idx" ON "sections"("module_id");
CREATE INDEX "section_photos_section_id_idx" ON "section_photos"("section_id");
CREATE INDEX "quiz_questions_section_id_idx" ON "quiz_questions"("section_id");
CREATE INDEX "enrollments_user_id_idx" ON "enrollments"("user_id");
CREATE UNIQUE INDEX "enrollments_user_id_course_id_key" ON "enrollments"("user_id", "course_id");
CREATE INDEX "section_completions_user_id_idx" ON "section_completions"("user_id");
CREATE UNIQUE INDEX "section_completions_user_id_section_id_key" ON "section_completions"("user_id", "section_id");
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX "payments_naboopay_reference_idx" ON "payments"("naboopay_reference");
CREATE INDEX "mentoring_bookings_user_id_idx" ON "mentoring_bookings"("user_id");
CREATE INDEX "qa_registrations_user_id_idx" ON "qa_registrations"("user_id");
CREATE UNIQUE INDEX "qa_registrations_session_id_user_id_key" ON "qa_registrations"("session_id", "user_id");
CREATE INDEX "work_submissions_user_id_idx" ON "work_submissions"("user_id");

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sections" ADD CONSTRAINT "sections_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "section_photos" ADD CONSTRAINT "section_photos_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "section_completions" ADD CONSTRAINT "section_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "section_completions" ADD CONSTRAINT "section_completions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mentoring_bookings" ADD CONSTRAINT "mentoring_bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "qa_registrations" ADD CONSTRAINT "qa_registrations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "qa_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "qa_registrations" ADD CONSTRAINT "qa_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_submissions" ADD CONSTRAINT "work_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
