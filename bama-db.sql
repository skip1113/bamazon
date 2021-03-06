DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

create table products (
	id int auto_increment not null,
    product_name varchar(60) null,
    department_name varchar(60) null,
    price decimal(10,2) null,
    stock_quantity int,
    primary key (id)
);
drop table products;
select * from products;
insert into products (product_name, department_name, price, stock_quantity)
value ("Tooth Paste", "Health", 5.99, 10);
insert into products (product_name, department_name, price, stock_quantity)
value ("Floss", "Health", 1.99, 15);
insert into products (product_name, department_name, price, stock_quantity)
value ("Tooth Brush", "Health", 12.99, 10);
create table productTwo (
	id int auto_increment not null,
    item varchar(60) null,
    product_sales decimal(10,2) default 0,
    pricing decimal(10,2) null,
    user_quantity int,
    primary key (id)
);
create table departments (
	department_id int auto_increment not null,
    department_name varchar(60) null,
    over_head_cost DECIMAL(10, 2),
    primary key (department_id)
);
SELECT * FROM departments;
INSERT INTO departments (department_name, over_head_cost)
VALUES ("News", 200),
("Tech", 400),
("Apparel", 50),
("Necessities", 300),
("Others", 100);