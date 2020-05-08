CREATE TABLE IF NOT EXISTS  public."user"
(
		id bigint NOT NULL,
		name character varying COLLATE pg_catalog."default",
		CONSTRAINT user_pkey PRIMARY KEY (id)
)
