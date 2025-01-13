ALTER TABLE "userLessons" ADD COLUMN "task_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "userLessons" ADD COLUMN "active" boolean DEFAULT true NOT NULL;