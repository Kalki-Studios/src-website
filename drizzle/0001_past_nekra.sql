CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"category" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"in_stock" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_password" text NOT NULL,
	"is_under_construction" boolean DEFAULT false NOT NULL,
	"auto_delete_timer" integer DEFAULT 2880 NOT NULL,
	"whatsapp_template" text DEFAULT 'Hi {name}, this is regarding your project request {ref} ({title}). I can take this up. Let''s discuss the details.' NOT NULL
);
