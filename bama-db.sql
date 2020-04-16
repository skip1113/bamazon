create database bamazon;
use bamazon;

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