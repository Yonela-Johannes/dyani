create table users(
    id serial primary key,
    name varchar(15),
    email text,
    lastname varchar(15),
    phone int,
    password int   
);

create table shoes(
    id serial primary key,
    image text,
    name varchar(15),
    brand varchar(15),
    price int,
    color varchar(15),
    old_price int,
    size int,
    in_stock int,
    buying_amount int,
    gender varchar(8),
    views int,
    add_to_cart int
);

create table banking_details(
    id serial primary key,
    user_id int,
    card_number varchar(20),
    date date,
    cvv int,
    foreign key(user_id) references users(id) on delete cascade
);

create table address(
    id serial primary key,
    user_id int,
    street varchar(40),
    city varchar(20),
    code int,
    foreign key(user_id) references users(id) on delete cascade
);
create table cart(  
        id serial primary key,
        user_id int,
        cart text,
        foreign key(user_id) references users(id) on delete cascade,
);