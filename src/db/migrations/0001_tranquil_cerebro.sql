ALTER TABLE "user_contexts" ADD COLUMN "daily_goal_chunks" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "daily_goal_chunks";