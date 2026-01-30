CREATE TABLE "checkin" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"overall_status" boolean NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "checkin_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "checkin_places_issue" (
	"id" serial PRIMARY KEY NOT NULL,
	"checkin_id" integer NOT NULL,
	"place_id" integer NOT NULL,
	"issue_id" integer NOT NULL,
	"observation" text
);
--> statement-breakpoint
CREATE TABLE "issue" (
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
CREATE TABLE "photo" (
	"id" serial PRIMARY KEY NOT NULL,
	"checkin_places_issue_id" integer NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lab" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issue" ADD CONSTRAINT "checkin_places_issue_checkin_id_checkin_id_fk" FOREIGN KEY ("checkin_id") REFERENCES "public"."checkin"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issue" ADD CONSTRAINT "checkin_places_issue_place_id_place_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."place"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_places_issue" ADD CONSTRAINT "checkin_places_issue_issue_id_issue_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo" ADD CONSTRAINT "photo_checkin_places_issue_id_checkin_places_issue_id_fk" FOREIGN KEY ("checkin_places_issue_id") REFERENCES "public"."checkin_places_issue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place" ADD CONSTRAINT "place_lab_lab_id_fk" FOREIGN KEY ("lab") REFERENCES "public"."lab"("id") ON DELETE no action ON UPDATE no action;