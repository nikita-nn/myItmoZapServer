ALTER TABLE "users" ADD COLUMN "accessTokenIssued" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refreshTokenIssued" timestamp NOT NULL;