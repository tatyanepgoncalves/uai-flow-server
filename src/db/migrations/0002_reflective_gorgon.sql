CREATE TABLE "user_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"chunks_mastered" integer DEFAULT 0 NOT NULL,
	"chunks_this_week" integer DEFAULT 0 NOT NULL,
	"current_streak_days" integer DEFAULT 0 NOT NULL,
	"streak_record_days" integer DEFAULT 0 NOT NULL,
	"recall_accuracy_percentage" real DEFAULT 0 NOT NULL,
	"total_immersion_minutes" integer DEFAULT 0 NOT NULL,
	"daily_avg_immersion_minutes" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;