create table merch_items (
                             id bigserial primary key,
                             title varchar(255) not null,
                             description text,
                             price_cents integer not null,
                             image_url varchar(500)
);

insert into merch_items (title, description, price_cents, image_url)
values
    (
        'Бандана',
        '',
        1200,
        'images/merch/bandana_1.jpg'
    );
