# Bamazon

# Link to deployed app: https://github.com/skip1113/bamazon

## Overview
This app is a online store representaion for a user to buy items that stores, updates and adds to the table to Mysql from Node.
### Command lines 
* node bamazonCustomer.js
* node bamazonManager.js
### Instructions
* Clone this repository and open the files terminal.
* In the terminal run the command "npm install" This will install the packages that this app uses from the package.json file.
* After the packages have finished installing, run the following command lines above and follow the prompts after the greeting.

* Customer Window 
![](/assets/images/customer-start.png)

* List Products

![](/assets/images/customer-list.png)

* Buy a product(s)

![](/assets/images/customer-buy.png)

* Manager Window

![](/assets/images/man-start.png)

* Manager Restock, add New Product, and view all stock and what's low

![](/assets/images/man-add.png)

## Organization:
* Created a Database, and Table from Mysql.
* Called the database from Mysql to node with Query, and connection.
* functions for Inquirer Prompts that take the data the user gives and pulls data from Mysql to give back to the user.
## Technologies used:
* Javascript
* Node.js
    * Require
* Node Packages:
    * Mysql
    * Inquirer
    * Table
    * Chalk