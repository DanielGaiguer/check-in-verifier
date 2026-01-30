ALTER TABLE "checkins" RENAME TO "checkin";--> statement-breakpoint
ALTER TABLE "checkin_places_issues" RENAME TO "checkin_places_issue";--> statement-breakpoint
ALTER TABLE "issues" RENAME TO "issue";--> statement-breakpoint
ALTER TABLE "photos" RENAME TO "photo";--> statement-breakpoint
ALTER TABLE "places" RENAME TO "place";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "photo" RENAME COLUMN "checkin_places_issues_id" TO "checkin_places_issue_id";--> statement-breakpoint
ALTER TABLE "checkin" DROP CONSTRAINT "checkins_date_unique";--> statement-breakpoint
ALTER TABLE "checkin_places_issue" DROP CONSTRAINT "checkin_places_issues_checkin_id_checkins_id_fk";
--> statement-breakpoint
ALTER TABLE "checkin_places_issue" DROP CONSTRAINT "checkin_places_issues_place_id_places_id_fk";
--> statement-breakpoint
ALTER TABLE "checkin_places_issue" DROP CONSTRAINT "checkin_places_issues_issue_id_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "checkin" DROP CONSTRAINT "checkins_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "photo" DROP CONSTRAINT "photos_checkin_places_issues_id_checkin_places_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "place" DROP CONSTRAINT "places_lab_lab_id_fk";
--> statement-breakpoint
ALTER TABLE "checkin_places_issue" ADD CONSTRAINT "checkin_places_issue_checkin_id_checkin_id_fk" FOREIGN KEY ("checkin_id") REFERENCES "public"."checkin"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issue" ADD CONSTRAINT "checkin_places_issue_place_id_place_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."place"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issue" ADD CONSTRAINT "checkin_places_issue_issue_id_issue_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo" ADD CONSTRAINT "photo_checkin_places_issue_id_checkin_places_issue_id_fk" FOREIGN KEY ("checkin_places_issue_id") REFERENCES "public"."checkin_places_issue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place" ADD CONSTRAINT "place_lab_lab_id_fk" FOREIGN KEY ("lab") REFERENCES "public"."lab"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_date_unique" UNIQUE("date");