DROP TABLE merch_items;
create table merch_items (
                             id bigserial primary key,
                             title varchar(255) not null,
                             description text,
                             image_url varchar(500)
);
