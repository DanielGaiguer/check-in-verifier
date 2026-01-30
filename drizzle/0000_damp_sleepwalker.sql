CREATE TABLE "checkin_places_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"checkin_id" integer NOT NULL,
	"place_id" integer NOT NULL,
	"issue_id" integer NOT NULL,
	"observation" text
);
--> statement-breakpoint
CREATE TABLE "checkins" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"overall_status" boolean NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "checkins_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lab" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"checkin_places_issues_id" integer NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lab" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "checkin_places_issues" ADD CONSTRAINT "checkin_places_issues_checkin_id_checkins_id_fk" FOREIGN KEY ("checkin_id") REFERENCES "public"."checkins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issues" ADD CONSTRAINT "checkin_places_issues_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issues" ADD CONSTRAINT "checkin_places_issues_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_checkin_places_issues_id_checkin_places_issues_id_fk" FOREIGN KEY ("checkin_places_issues_id") REFERENCES "public"."checkin_places_issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_lab_lab_id_fk" FOREIGN KEY ("lab") REFERENCES "public"."lab"("id") ON DELETE no action ON UPDATE no action;