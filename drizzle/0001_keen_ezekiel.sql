CREATE TABLE "checkin_places_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"checkin_id" integer NOT NULL,
	"place_id" integer NOT NULL,
	"issue_id" integer NOT NULL,
	"observation" text
);
--> statement-breakpoint
ALTER TABLE "checkin_workbench_issues " DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "checkin_workbench_issues " CASCADE;--> statement-breakpoint
ALTER TABLE "photos" RENAME COLUMN "checkin_workbench_issues_id" TO "checkin_places_issues_id";--> statement-breakpoint
ALTER TABLE "photos" DROP CONSTRAINT "photos_checkin_workbench_issues_id_checkin_workbench_issues _id_fk";
--> statement-breakpoint
ALTER TABLE "checkin_places_issues" ADD CONSTRAINT "checkin_places_issues_checkin_id_checkins_id_fk" FOREIGN KEY ("checkin_id") REFERENCES "public"."checkins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issues" ADD CONSTRAINT "checkin_places_issues_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issues" ADD CONSTRAINT "checkin_places_issues_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_checkin_places_issues_id_checkin_places_issues_id_fk" FOREIGN KEY ("checkin_places_issues_id") REFERENCES "public"."checkin_places_issues"("id") ON DELETE no action ON UPDATE no action;