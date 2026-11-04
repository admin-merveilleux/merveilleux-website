import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
})

async function run() {
  await client.connect()
  console.log('Connected to Postgres Neon...')

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_article_ctas_funnel" AS ENUM('tofu', 'mofu', 'bofu', 'all');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "public"."article_ctas" (
      "id" serial PRIMARY KEY NOT NULL,
      "internal_name" varchar NOT NULL,
      "funnel" "enum_article_ctas_funnel" DEFAULT 'mofu' NOT NULL,
      "is_active" boolean DEFAULT true,
      "button_url" varchar NOT NULL,
      "image_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "public"."article_ctas_locales" (
      "title" varchar NOT NULL,
      "subtitle" varchar NOT NULL,
      "text" varchar NOT NULL,
      "button_text" varchar NOT NULL,
      "badge" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."article_ctas"("id") ON DELETE cascade
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "article_ctas_locales_parent_id_locale_unique" 
      ON "public"."article_ctas_locales" ("_parent_id", "_locale");

    CREATE TABLE IF NOT EXISTS "public"."article_ctas_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "public"."article_ctas"("id") ON DELETE cascade,
      "path" varchar NOT NULL,
      "media_id" integer REFERENCES "public"."media"("id") ON DELETE set null,
      "users_id" integer REFERENCES "public"."users"("id") ON DELETE set null
    );

    CREATE INDEX IF NOT EXISTS "article_ctas_rels_parent_idx" ON "public"."article_ctas_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "article_ctas_rels_path_idx" ON "public"."article_ctas_rels" ("path");

    -- Version tables for article_ctas
    CREATE TABLE IF NOT EXISTS "public"."_article_ctas_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer REFERENCES "public"."article_ctas"("id") ON DELETE set null,
      "version_internal_name" varchar NOT NULL,
      "version_funnel" "enum_article_ctas_funnel" DEFAULT 'mofu' NOT NULL,
      "version_is_active" boolean DEFAULT true,
      "version_button_url" varchar NOT NULL,
      "version_image_id" integer,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "public"."_article_ctas_v_locales" (
      "version_title" varchar NOT NULL,
      "version_subtitle" varchar NOT NULL,
      "version_text" varchar NOT NULL,
      "version_button_text" varchar NOT NULL,
      "version_badge" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "public"."_article_ctas_v"("id") ON DELETE cascade
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "_article_ctas_v_locales_parent_id_locale_unique" 
      ON "public"."_article_ctas_v_locales" ("_parent_id", "_locale");

    CREATE TABLE IF NOT EXISTS "public"."_article_ctas_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "public"."_article_ctas_v"("id") ON DELETE cascade,
      "path" varchar NOT NULL,
      "media_id" integer REFERENCES "public"."media"("id") ON DELETE set null,
      "users_id" integer REFERENCES "public"."users"("id") ON DELETE set null
    );

    CREATE INDEX IF NOT EXISTS "_article_ctas_v_rels_parent_idx" ON "public"."_article_ctas_v_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_article_ctas_v_rels_path_idx" ON "public"."_article_ctas_v_rels" ("path");

    -- Add cta relations to articles and _articles_v
    ALTER TABLE "public"."articles" 
      ADD COLUMN IF NOT EXISTS "cta_id" integer REFERENCES "public"."article_ctas"("id") ON DELETE set null;

    ALTER TABLE "public"."_articles_v" 
      ADD COLUMN IF NOT EXISTS "version_cta_id" integer REFERENCES "public"."article_ctas"("id") ON DELETE set null;

    ALTER TABLE "public"."payload_locked_documents_rels" 
      ADD COLUMN IF NOT EXISTS "article_ctas_id" integer REFERENCES "public"."article_ctas"("id") ON DELETE cascade;
  `)

  console.log('SQL DDL Migration completed successfully!')
  await client.end()
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
