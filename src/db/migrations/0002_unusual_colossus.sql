ALTER TABLE "users" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_isu_id_unique" UNIQUE("isu_id");