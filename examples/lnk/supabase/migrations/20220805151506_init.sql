-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.links
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    slug text COLLATE pg_catalog."default" NOT NULL,
    target_url text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT links_pkey PRIMARY KEY (id),
    CONSTRAINT links_slug_key UNIQUE (slug)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.links
    OWNER to postgres;

ALTER TABLE IF EXISTS public.links
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.links TO anon;

GRANT ALL ON TABLE public.links TO authenticated;

GRANT ALL ON TABLE public.links TO postgres;

GRANT ALL ON TABLE public.links TO service_role;
CREATE POLICY "Enable read access for all users"
    ON public.links
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);
CREATE POLICY "Enable write access for all users"
    ON public.links
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true);
