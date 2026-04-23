ALTER TYPE "public"."checkin_status" ADD VALUE 'not_checked';--> statement-breakpoint
CREATE TABLE "checkin_edits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checkin_id" uuid,
	"people_id" uuid,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "checkin_edits_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "checkin_item_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checkin_item_id" uuid NOT NULL,
	"photo_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "checkin_item_photos_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "checkin_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checkin_id" uuid NOT NULL,
	"place_id" uuid NOT NULL,
	"status" "checkin_status" NOT NULL,
	"observation" text,
	CONSTRAINT "checkin_items_id_unique" UNIQUE("id"),
	CONSTRAINT "unique_checkin_place" UNIQUE("checkin_id","place_id")
);
--> statement-breakpoint
CREATE TABLE "checkin_items_problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checkin_item_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "checkin_items_problems_id_unique" UNIQUE("id"),
	CONSTRAINT "unique_item_problem" UNIQUE("checkin_item_id","problem_id")
);
--> statement-breakpoint
CREATE TABLE "laboratories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"unit_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "laboratories_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "people_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "place_problems" (
	"place_id" uuid,
	"problem_id" uuid,
	CONSTRAINT "place_problems_place_id_problem_id_pk" PRIMARY KEY("place_id","problem_id")
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "problems_id_unique" UNIQUE("id"),
	CONSTRAINT "problems_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "units_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "checkin_audit_logs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "checkin_place_issues" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "checkin_places" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "issues" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lab" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "photos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "checkin_audit_logs" CASCADE;--> statement-breakpoint
DROP TABLE "checkin_place_issues" CASCADE;--> statement-breakpoint
DROP TABLE "checkin_places" CASCADE;--> statement-breakpoint
DROP TABLE "issues" CASCADE;--> statement-breakpoint
DROP TABLE "lab" CASCADE;--> statement-breakpoint
DROP TABLE "photos" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "checkins" DROP CONSTRAINT "checkins_date_unique";--> statement-breakpoint
ALTER TABLE "checkins" DROP CONSTRAINT "checkins_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "places" DROP CONSTRAINT "places_lab_id_lab_id_fk";
--> statement-breakpoint
ALTER TABLE "places" ALTER COLUMN "lab_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "checkins" ADD COLUMN "people_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "checkins" ADD COLUMN "unit_id" uuid;--> statement-breakpoint
ALTER TABLE "checkins" ADD COLUMN "observation" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "sort_order" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "checkin_edits" ADD CONSTRAINT "checkin_edits_checkin_id_checkins_id_fk" FOREIGN KEY ("checkin_id") REFERENCES "public"."checkins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_edits" ADD CONSTRAINT "checkin_edits_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_item_photos" ADD CONSTRAINT "checkin_item_photos_checkin_item_id_checkin_items_id_fk" FOREIGN KEY ("checkin_item_id") REFERENCES "public"."checkin_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_items" ADD CONSTRAINT "checkin_items_checkin_id_checkins_id_fk" FOREIGN KEY ("checkin_id") REFERENCES "public"."checkins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_items" ADD CONSTRAINT "checkin_items_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_items_problems" ADD CONSTRAINT "checkin_items_problems_checkin_item_id_checkin_items_id_fk" FOREIGN KEY ("checkin_item_id") REFERENCES "public"."checkin_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_items_problems" ADD CONSTRAINT "checkin_items_problems_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laboratories" ADD CONSTRAINT "laboratories_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_problems" ADD CONSTRAINT "place_problems_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_problems" ADD CONSTRAINT "place_problems_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_checkin_item_photos_problem" ON "checkin_item_photos" USING btree ("checkin_item_id");--> statement-breakpoint
CREATE INDEX "idx_checkin_items_checkin" ON "checkin_items" USING btree ("checkin_id");--> statement-breakpoint
CREATE INDEX "idx_checkin_items_place" ON "checkin_items" USING btree ("place_id");--> statement-breakpoint
CREATE INDEX "idx_checkin_items_problems_item" ON "checkin_items_problems" USING btree ("checkin_item_id");--> statement-breakpoint
CREATE INDEX "idx_checkin_items_problems_problem" ON "checkin_items_problems" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "idx_labs_unit" ON "laboratories" USING btree ("unit_id");--> statement-breakpoint
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_lab_id_laboratories_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."laboratories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_checkins_date" ON "checkins" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_checkins_people" ON "checkins" USING btree ("people_id");--> statement-breakpoint
CREATE INDEX "idx_checkins_unit" ON "checkins" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "idx_places_lab" ON "places" USING btree ("lab_id");--> statement-breakpoint
ALTER TABLE "checkins" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_id_unique" UNIQUE("id");
INSERT INTO "units" ("name") VALUES ('Celso Charuri');
INSERT INTO "units" ("name") VALUES ('Belém');
UPDATE "checkins" SET "unit_id" = (SELECT id FROM "units" WHERE name = 'Celso Charuri') WHERE "unit_id" IS NULL;
ALTER TABLE "checkins" ALTER COLUMN "unit_id" SET NOT NULL;
UPDATE "laboratories" SET "unit_id" = (SELECT id FROM "units" WHERE name = 'Celso Charuri') WHERE "unit_id" IS NULL;
ALTER TABLE "laboratories" ALTER COLUMN "unit_id" SET NOT NULL;