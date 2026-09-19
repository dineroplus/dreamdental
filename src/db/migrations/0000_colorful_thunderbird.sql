CREATE SCHEMA "cms";
--> statement-breakpoint
CREATE TABLE "cms"."bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"message" text,
	"service_slug" text,
	"locale" text,
	"source_path" text,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms"."documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"slug" text NOT NULL,
	"order" integer DEFAULT 100 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "cms"."media" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"url" text NOT NULL,
	"mime_type" text NOT NULL,
	"width" integer,
	"height" integer,
	"filesize" integer,
	"sizes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"alt" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"caption" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"credit" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms"."revisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"target" text NOT NULL,
	"document_id" integer,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer
);
--> statement-breakpoint
CREATE TABLE "cms"."singletons" (
	"key" text PRIMARY KEY NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "cms"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" text DEFAULT 'editor' NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "cms"."bookings" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "documents_type_slug_key" ON "cms"."documents" USING btree ("type","slug");--> statement-breakpoint
CREATE INDEX "documents_type_order_idx" ON "cms"."documents" USING btree ("type","order");--> statement-breakpoint
CREATE UNIQUE INDEX "media_filename_key" ON "cms"."media" USING btree ("filename");--> statement-breakpoint
CREATE INDEX "revisions_target_idx" ON "cms"."revisions" USING btree ("target","document_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "cms"."users" USING btree ("email");