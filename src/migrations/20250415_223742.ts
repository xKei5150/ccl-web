import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_personal_information_demographics_sex" AS ENUM('male', 'female', 'other');
  CREATE TYPE "public"."enum_personal_information_demographics_marital_status" AS ENUM('single', 'married', 'divorced', 'widowed');
  CREATE TYPE "public"."enum_personal_information_status_residency_status" AS ENUM('renting', 'own-mortgage', 'own-outright');
  CREATE TYPE "public"."enum_personal_information_status_life_status" AS ENUM('alive', 'deceased');
  CREATE TYPE "public"."enum_business_type_of_ownership" AS ENUM('sole proprietorship', 'partnership', 'corporation', 'llc');
  CREATE TYPE "public"."enum_business_type_of_corporation" AS ENUM('public', 'private', 'non-profit');
  CREATE TYPE "public"."enum_business_status" AS ENUM('active', 'inactive', 'pending');
  CREATE TYPE "public"."enum_business_permits_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_requests_type" AS ENUM('indigencyCertificate', 'barangayClearance', 'barangayResidency');
  CREATE TYPE "public"."enum_requests_status" AS ENUM('pending', 'processing', 'approved', 'rejected', 'completed');
  CREATE TYPE "public"."enum_households_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_reports_involved_persons_role" AS ENUM('complainant', 'respondent', 'witness', 'other');
  CREATE TYPE "public"."enum_reports_report_status" AS ENUM('open', 'inProgress', 'closed');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'staff', 'citizen');
  CREATE TYPE "public"."enum_users_is_active" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "personal_information" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name_first_name" varchar NOT NULL,
  	"name_middle_name" varchar,
  	"name_last_name" varchar NOT NULL,
  	"name_full_name" varchar,
  	"contact_email_address" varchar,
  	"contact_local_address" varchar,
  	"demographics_sex" "enum_personal_information_demographics_sex",
  	"demographics_birth_date" timestamp(3) with time zone,
  	"demographics_marital_status" "enum_personal_information_demographics_marital_status",
  	"status_residency_status" "enum_personal_information_status_residency_status",
  	"status_life_status" "enum_personal_information_status_life_status",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "profile_photo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "business_owners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"owner_name" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "business" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"business_name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"registration_date" timestamp(3) with time zone NOT NULL,
  	"type_of_ownership" "enum_business_type_of_ownership" NOT NULL,
  	"type_of_corporation" "enum_business_type_of_corporation",
  	"business_contact_no" varchar,
  	"business_email_address" varchar NOT NULL,
  	"status" "enum_business_status",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "business_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"supporting_documents_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "supporting_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "business_permits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"business_id" integer NOT NULL,
  	"validity" timestamp(3) with time zone NOT NULL,
  	"official_receipt_no" varchar NOT NULL,
  	"issued_to" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"payment_date" timestamp(3) with time zone,
  	"status" "enum_business_permits_status",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "business_permits_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"supporting_documents_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_requests_type" NOT NULL,
  	"person_id" integer NOT NULL,
  	"purpose" varchar,
  	"additional_information_for_whom" varchar,
  	"additional_information_remarks" varchar,
  	"additional_information_duration" varchar,
  	"status" "enum_requests_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"supporting_documents_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "households_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"member_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "households" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"family_name" varchar NOT NULL,
  	"local_address" varchar NOT NULL,
  	"status" "enum_households_status" NOT NULL,
  	"residency_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "reports_involved_persons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_reports_involved_persons_role" NOT NULL,
  	"statement" varchar,
  	"personal_info_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"description" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"report_status" "enum_reports_report_status" DEFAULT 'open',
  	"submitted_by_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "reports_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"supporting_documents_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'citizen' NOT NULL,
  	"personal_info_id" integer,
  	"is_active" "enum_users_is_active" DEFAULT 'active',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"author_id" integer NOT NULL,
  	"content" varchar NOT NULL,
  	"slug" varchar,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"status" "enum_posts_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "storage_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"personal_information_id" integer,
  	"profile_photo_id" integer,
  	"business_id" integer,
  	"supporting_documents_id" integer,
  	"business_permits_id" integer,
  	"requests_id" integer,
  	"households_id" integer,
  	"reports_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"posts_id" integer,
  	"storage_folders_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "theme_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"background" varchar,
  	"foreground" varchar,
  	"card" varchar,
  	"card_foreground" varchar,
  	"popover" varchar,
  	"popover_foreground" varchar,
  	"primary" varchar,
  	"primary_foreground" varchar,
  	"secondary" varchar,
  	"secondary_foreground" varchar,
  	"muted" varchar,
  	"muted_foreground" varchar,
  	"accent" varchar,
  	"accent_foreground" varchar,
  	"destructive" varchar,
  	"destructive_foreground" varchar,
  	"border" varchar,
  	"input" varchar,
  	"ring" varchar,
  	"sidebar_background" varchar,
  	"sidebar_foreground" varchar,
  	"sidebar_primary" varchar,
  	"sidebar_primary_foreground" varchar,
  	"sidebar_accent" varchar,
  	"sidebar_accent_foreground" varchar,
  	"sidebar_border" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"hero_image_id" integer,
  	"auth_image_id" integer,
  	"logo_id" integer NOT NULL,
  	"favicon_id" integer,
  	"description" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"address" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DO $$ BEGIN
   ALTER TABLE "personal_information" ADD CONSTRAINT "personal_information_photo_id_profile_photo_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."profile_photo"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_owners" ADD CONSTRAINT "business_owners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_rels" ADD CONSTRAINT "business_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_rels" ADD CONSTRAINT "business_rels_supporting_documents_fk" FOREIGN KEY ("supporting_documents_id") REFERENCES "public"."supporting_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_permits" ADD CONSTRAINT "business_permits_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_permits_rels" ADD CONSTRAINT "business_permits_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."business_permits"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_permits_rels" ADD CONSTRAINT "business_permits_rels_supporting_documents_fk" FOREIGN KEY ("supporting_documents_id") REFERENCES "public"."supporting_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "requests" ADD CONSTRAINT "requests_person_id_personal_information_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."personal_information"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "requests_rels" ADD CONSTRAINT "requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "requests_rels" ADD CONSTRAINT "requests_rels_supporting_documents_fk" FOREIGN KEY ("supporting_documents_id") REFERENCES "public"."supporting_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "households_members" ADD CONSTRAINT "households_members_member_id_personal_information_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."personal_information"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "households_members" ADD CONSTRAINT "households_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "reports_involved_persons" ADD CONSTRAINT "reports_involved_persons_personal_info_id_personal_information_id_fk" FOREIGN KEY ("personal_info_id") REFERENCES "public"."personal_information"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "reports_involved_persons" ADD CONSTRAINT "reports_involved_persons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "reports" ADD CONSTRAINT "reports_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_supporting_documents_fk" FOREIGN KEY ("supporting_documents_id") REFERENCES "public"."supporting_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_storage_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."storage_folders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users" ADD CONSTRAINT "users_personal_info_id_personal_information_id_fk" FOREIGN KEY ("personal_info_id") REFERENCES "public"."personal_information"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "storage_folders" ADD CONSTRAINT "storage_folders_parent_id_storage_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."storage_folders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_personal_information_fk" FOREIGN KEY ("personal_information_id") REFERENCES "public"."personal_information"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_profile_photo_fk" FOREIGN KEY ("profile_photo_id") REFERENCES "public"."profile_photo"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_business_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_supporting_documents_fk" FOREIGN KEY ("supporting_documents_id") REFERENCES "public"."supporting_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_business_permits_fk" FOREIGN KEY ("business_permits_id") REFERENCES "public"."business_permits"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_requests_fk" FOREIGN KEY ("requests_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_households_fk" FOREIGN KEY ("households_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_storage_folders_fk" FOREIGN KEY ("storage_folders_id") REFERENCES "public"."storage_folders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_auth_image_id_media_id_fk" FOREIGN KEY ("auth_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "personal_information_photo_idx" ON "personal_information" USING btree ("photo_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "personal_information_contact_contact_email_address_idx" ON "personal_information" USING btree ("contact_email_address");
  CREATE INDEX IF NOT EXISTS "personal_information_updated_at_idx" ON "personal_information" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "personal_information_created_at_idx" ON "personal_information" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "profile_photo_updated_at_idx" ON "profile_photo" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "profile_photo_created_at_idx" ON "profile_photo" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "profile_photo_filename_idx" ON "profile_photo" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "profile_photo_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "profile_photo" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "profile_photo_sizes_card_sizes_card_filename_idx" ON "profile_photo" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "profile_photo_sizes_tablet_sizes_tablet_filename_idx" ON "profile_photo" USING btree ("sizes_tablet_filename");
  CREATE INDEX IF NOT EXISTS "business_owners_order_idx" ON "business_owners" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "business_owners_parent_id_idx" ON "business_owners" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "business_business_email_address_idx" ON "business" USING btree ("business_email_address");
  CREATE INDEX IF NOT EXISTS "business_updated_at_idx" ON "business" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "business_created_at_idx" ON "business" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "business_rels_order_idx" ON "business_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "business_rels_parent_idx" ON "business_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "business_rels_path_idx" ON "business_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "business_rels_supporting_documents_id_idx" ON "business_rels" USING btree ("supporting_documents_id");
  CREATE INDEX IF NOT EXISTS "supporting_documents_updated_at_idx" ON "supporting_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "supporting_documents_created_at_idx" ON "supporting_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "supporting_documents_filename_idx" ON "supporting_documents" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "business_permits_business_idx" ON "business_permits" USING btree ("business_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "business_permits_official_receipt_no_idx" ON "business_permits" USING btree ("official_receipt_no");
  CREATE INDEX IF NOT EXISTS "business_permits_updated_at_idx" ON "business_permits" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "business_permits_created_at_idx" ON "business_permits" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "business_permits_rels_order_idx" ON "business_permits_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "business_permits_rels_parent_idx" ON "business_permits_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "business_permits_rels_path_idx" ON "business_permits_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "business_permits_rels_supporting_documents_id_idx" ON "business_permits_rels" USING btree ("supporting_documents_id");
  CREATE INDEX IF NOT EXISTS "requests_person_idx" ON "requests" USING btree ("person_id");
  CREATE INDEX IF NOT EXISTS "requests_updated_at_idx" ON "requests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "requests_created_at_idx" ON "requests" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "requests_rels_order_idx" ON "requests_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "requests_rels_parent_idx" ON "requests_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "requests_rels_path_idx" ON "requests_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "requests_rels_supporting_documents_id_idx" ON "requests_rels" USING btree ("supporting_documents_id");
  CREATE INDEX IF NOT EXISTS "households_members_order_idx" ON "households_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "households_members_parent_id_idx" ON "households_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "households_members_member_idx" ON "households_members" USING btree ("member_id");
  CREATE INDEX IF NOT EXISTS "households_updated_at_idx" ON "households" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "households_created_at_idx" ON "households" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "reports_involved_persons_order_idx" ON "reports_involved_persons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "reports_involved_persons_parent_id_idx" ON "reports_involved_persons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "reports_involved_persons_personal_info_idx" ON "reports_involved_persons" USING btree ("personal_info_id");
  CREATE INDEX IF NOT EXISTS "reports_submitted_by_idx" ON "reports" USING btree ("submitted_by_id");
  CREATE INDEX IF NOT EXISTS "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "reports_rels_order_idx" ON "reports_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "reports_rels_parent_idx" ON "reports_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "reports_rels_path_idx" ON "reports_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "reports_rels_supporting_documents_id_idx" ON "reports_rels" USING btree ("supporting_documents_id");
  CREATE INDEX IF NOT EXISTS "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX IF NOT EXISTS "users_personal_info_idx" ON "users" USING btree ("personal_info_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "storage_folders_parent_idx" ON "storage_folders" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "storage_folders_updated_at_idx" ON "storage_folders" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "storage_folders_created_at_idx" ON "storage_folders" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_personal_information_id_idx" ON "payload_locked_documents_rels" USING btree ("personal_information_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_profile_photo_id_idx" ON "payload_locked_documents_rels" USING btree ("profile_photo_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_business_id_idx" ON "payload_locked_documents_rels" USING btree ("business_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_supporting_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("supporting_documents_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_business_permits_id_idx" ON "payload_locked_documents_rels" USING btree ("business_permits_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("requests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_households_id_idx" ON "payload_locked_documents_rels" USING btree ("households_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_storage_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("storage_folders_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "site_settings_auth_image_idx" ON "site_settings" USING btree ("auth_image_id");
  CREATE INDEX IF NOT EXISTS "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "personal_information" CASCADE;
  DROP TABLE "profile_photo" CASCADE;
  DROP TABLE "business_owners" CASCADE;
  DROP TABLE "business" CASCADE;
  DROP TABLE "business_rels" CASCADE;
  DROP TABLE "supporting_documents" CASCADE;
  DROP TABLE "business_permits" CASCADE;
  DROP TABLE "business_permits_rels" CASCADE;
  DROP TABLE "requests" CASCADE;
  DROP TABLE "requests_rels" CASCADE;
  DROP TABLE "households_members" CASCADE;
  DROP TABLE "households" CASCADE;
  DROP TABLE "reports_involved_persons" CASCADE;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "storage_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "theme_settings" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_personal_information_demographics_sex";
  DROP TYPE "public"."enum_personal_information_demographics_marital_status";
  DROP TYPE "public"."enum_personal_information_status_residency_status";
  DROP TYPE "public"."enum_personal_information_status_life_status";
  DROP TYPE "public"."enum_business_type_of_ownership";
  DROP TYPE "public"."enum_business_type_of_corporation";
  DROP TYPE "public"."enum_business_status";
  DROP TYPE "public"."enum_business_permits_status";
  DROP TYPE "public"."enum_requests_type";
  DROP TYPE "public"."enum_requests_status";
  DROP TYPE "public"."enum_households_status";
  DROP TYPE "public"."enum_reports_involved_persons_role";
  DROP TYPE "public"."enum_reports_report_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_is_active";
  DROP TYPE "public"."enum_posts_status";`)
}
