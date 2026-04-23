CREATE TABLE "units" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "active" boolean DEFAULT true NOT NULL
);

ALTER TABLE "checkins"
ADD COLUMN "unit_id" uuid;

ALTER TABLE "checkins"
ADD CONSTRAINT "checkins_unit_id_units_id_fk"
FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id")
ON DELETE RESTRICT;

ALTER TABLE "laboratories"
ADD COLUMN "unit_id" uuid;

ALTER TABLE "laboratories"
ADD CONSTRAINT "laboratories_unit_id_units_id_fk"
FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id")
ON DELETE RESTRICT;

CREATE INDEX "idx_checkins_unit" ON "checkins" ("unit_id");
CREATE INDEX "idx_labs_unit" ON "laboratories" ("unit_id");

INSERT INTO "units" ("name") VALUES ('Celso Charuri');
INSERT INTO "units" ("name") VALUES ('Belém');
UPDATE "checkins" SET "unit_id" = (SELECT id FROM "units" WHERE name = 'Celso Charuri') WHERE "unit_id" IS NULL;
ALTER TABLE "checkins" ALTER COLUMN "unit_id" SET NOT NULL;
UPDATE "laboratories" SET "unit_id" = (SELECT id FROM "units" WHERE name = 'Celso Charuri') WHERE "unit_id" IS NULL;
ALTER TABLE "laboratories" ALTER COLUMN "unit_id" SET NOT NULL;

ALTER TABLE "checkins"
ALTER COLUMN "unit_id" SET NOT NULL;

ALTER TABLE "laboratories"
ALTER COLUMN "unit_id" SET NOT NULL;