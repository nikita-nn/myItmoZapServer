CREATE TYPE "public"."loadEnum" AS ENUM('light', 'medium', 'hard');--> statement-breakpoint
CREATE TABLE "instances" (
	"id" serial NOT NULL,
	"name" varchar NOT NULL,
	"requests" varchar NOT NULL,
	"isReady" boolean DEFAULT false NOT NULL,
	"loadStatus" "loadEnum" DEFAULT 'light' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userLessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"isu_id" varchar,
	"createdAt" timestamp DEFAULT now(),
	"closedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"isu_id" varchar PRIMARY KEY NOT NULL,
	"password" varchar NOT NULL,
	"refresh_token" varchar NOT NULL,
	"access_token" varchar NOT NULL,
	CONSTRAINT "users_isu_id_unique" UNIQUE("isu_id")
);
--> statement-breakpoint
ALTER TABLE "userLessons" ADD CONSTRAINT "userLessons_isu_id_users_isu_id_fk" FOREIGN KEY ("isu_id") REFERENCES "public"."users"("isu_id") ON DELETE no action ON UPDATE no action;