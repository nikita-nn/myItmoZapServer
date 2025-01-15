CREATE TABLE "nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"name" varchar NOT NULL,
	"ping" integer,
	CONSTRAINT "nodes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "userLessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"isu_id" varchar,
	"task_id" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"closedAt" timestamp,
	"active" boolean DEFAULT true NOT NULL
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