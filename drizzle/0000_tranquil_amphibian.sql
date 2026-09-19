CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"size_bytes" serial NOT NULL,
	"mime_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ref_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"student_name" text NOT NULL,
	"college" text NOT NULL,
	"phone" text NOT NULL,
	"whatsapp" text,
	"email" text NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"deliverable" text NOT NULL,
	"tech_notes" text,
	"branch_answers" jsonb,
	"deadline" date NOT NULL,
	"budget_band" text NOT NULL,
	"extra_notes" text,
	"source" text,
	"status" text DEFAULT 'new' NOT NULL,
	"starred" boolean DEFAULT false NOT NULL,
	"admin_notes" text,
	"rejected_at" timestamp,
	CONSTRAINT "requests_ref_code_unique" UNIQUE("ref_code")
);
--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;