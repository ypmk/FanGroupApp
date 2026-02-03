create table if not exists cart_items (
    id bigserial primary key,
    user_id bigint not null references users(id) on delete cascade,
    merch_item_id bigint not null references merch_items(id) on delete cascade,
    qty integer not null,
    constraint uq_cart_user_merch unique (user_id, merch_item_id)
);
