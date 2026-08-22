-- CreateTable
CREATE TABLE "section" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "description" TEXT,
    "rule" TEXT NOT NULL,
    "checks" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_rule" (
    "tag_id" INTEGER NOT NULL,
    "rule_id" INTEGER NOT NULL,

    CONSTRAINT "tag_rule_pkey" PRIMARY KEY ("tag_id","rule_id")
);

-- CreateTable
CREATE TABLE "tag_section" (
    "tag_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "tag_section_pkey" PRIMARY KEY ("tag_id","section_id")
);

-- AddForeignKey
ALTER TABLE "rule" ADD CONSTRAINT "rule_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_rule" ADD CONSTRAINT "tag_rule_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_rule" ADD CONSTRAINT "tag_rule_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_section" ADD CONSTRAINT "tag_section_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_section" ADD CONSTRAINT "tag_section_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
