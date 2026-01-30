create table users (
                       id bigserial primary key,
                       username varchar(100) not null unique,
                       password varchar(255) not null,
                       enabled boolean not null default true
);

create table roles (
                       id bigserial primary key,
                       name varchar(50) not null unique
);

create table user_roles (
                            user_id bigint not null references users(id) on delete cascade,
                            role_id bigint not null references roles(id) on delete cascade,
                            primary key (user_id, role_id)
);

insert into roles(name) values ('ROLE_ADMIN'), ('ROLE_USER');
