create table users(
    id serial primary key,
    name varchar(15),
    email text,
    lastname varchar(15),
    password text
);

create table shoes(
    id serial primary key,
    image text,
    name varchar(15),
    brand varchar(15),
    price int,
    color varchar(15),
    size int,
    in_stock int,
    buying_amount int,
    gender varchar(8)
);

create table cart(  
        id serial primary key,
        user_id int,
        cart text,
        foreign key(user_id) references users(id) on delete cascade
);
