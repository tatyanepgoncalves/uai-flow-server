CREATE TABLE "user_competencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"level" "current_level_cefr" DEFAULT 'A1' NOT NULL,
	"level_label" text,
	"percentage" integer DEFAULT 0 NOT NULL,
	"tier" text NOT NULL,
	"clusters" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_weekly_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"week_number" integer NOT NULL,
	"daily_chunks_current" integer DEFAULT 0 NOT NULL,
	"daily_chunks_target" integer DEFAULT 20 NOT NULL,
	"daily_chunks_subtext" text,
	"pronunciation_drills_current" integer DEFAULT 0 NOT NULL,
	"pronunciation_drills_target" integer DEFAULT 5 NOT NULL,
	"pronunciation_next_topic" text,
	"active_listening_minutes_current" integer DEFAULT 0 NOT NULL,
	"active_listening_minutes_target" integer DEFAULT 60 NOT NULL,
	"active_listening_source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_competencies" ADD CONSTRAINT "user_competencies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_weekly_goals" ADD CONSTRAINT "user_weekly_goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;