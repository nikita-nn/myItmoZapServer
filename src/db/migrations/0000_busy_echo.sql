CREATE TYPE "public"."loadEnum" AS ENUM('light', 'medium', 'hard');--> statement-breakpoint
CREATE TABLE "instances" (
	"id" serial NOT NULL,
	"name" varchar NOT NULL,
	"requests" varchar NOT NULL,
	"isReady" boolean DEFAULT false NOT NULL,
	"loadStatus" "loadEnum" DEFAULT 'light' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"refresh_token" varchar NOT NULL,
	"access_token" varchar NOT NULL
);
