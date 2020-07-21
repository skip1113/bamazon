const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');
const chalk = require('chalk');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("You've connected as ID " + connection.threadId + "\n");
    promptManager();
})
function promptManager() {
    console.log(chalk.yellow("==========================================="));
    console.log(chalk.yellow("=          Welcome Manager!               ="));
    console.log(chalk.yellow("===========================================\n"));
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do today?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "View Products for Sale":
                // readStore();
                dataTable();
                break;

            case "View Low Inventory":

                lowStock();
                break;
            case "Add to Inventory":
                addProduct();
                break;
            case "Add New Product":
                createProduct();
                break;
            case "Exit":
                connection.end();
            // break;
        }
    })
}
//Selecting items that have a quantity that is 3 or less from Mysql data table
function lowStock() {
    connection.query("Select * from products where stock_quantity<=3", function (err, res) {
        if (err) throw err;
        // console.log(res);
        for (var i= 0; i < res.length; i ++){
            var number = res[i].id;
            var name = res[i].product_name;
            var depName = res[i].department_name;
            var worth = res[i].price;
            var stock = res[i].stock_quantity;
            console.table([
                {
                    ID: number,
                    Product: name,
                    Department: depName,
                    Price: worth,
                    Quantity: stock
                }
            ]);
        }
        userContinue();
    })
}
function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What is the ID of the product that you are restocking?"
        },
        {
            type: "input",
            name: "unit",
            message: "How many units of that product?"
        }
    ]).then(function (data) {
        console.log(chalk.blueBright("You want item: " + data.id));
        console.log(chalk.blueBright("You want this many: " + data.unit));
        connection.query("Select stock_quantity, price, product_name from products where ?", { id: data.id}, 
            function(err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                // console.log(res[i].stock_quantity);
                // console.log(data.unit);
                
                    //Updates an item from "products" data table the user selects
                    if (res[i].stock_quantity > 0) {
                        console.log(chalk.green("Adding to stock: " + res[i].product_name));
                        var newStock = res[i].stock_quantity + parseInt(data.unit);
                        // console.log(newStock);
                        connection.query(
                            "UPDATE products set? where?",
                            [
                                {
                                    stock_quantity: newStock
                                },
                                {
                                    id: data.id
                                }
                            ],
                            function(error, response) {
                                if(error) throw error;
                                console.log(chalk.green("Item(s) Successfully added to inventory"));
                                console.log(chalk.magentaBright(response.affectedRows + " Products Edited!\n"));
                                userContinue();
                            }
                        )
                    }
               
                }
            })
        
    })
}
function createProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the item you'd like to create?"
        },
        {
            type: "input",
            name: "department",
            message: "What department should this be added to?"
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of the item?"
        },
        {
            type: "input",
            name: "stock",
            message: "How many should we stock?"
        }
    ]).then(function(create) {
        //Inserts a new item to the database "products" that the user creates
        connection.query("INSERT INTO products SET ?",
            {
                product_name: create.name,
                department_name: create.department,
                price: create.price,
                stock_quantity: create.stock
            },function(err){
                if(err) throw err;
                console.log(chalk.greenBright("New item has been created"));
                userContinue();
            }
        )
    })
}
function userContinue() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "prompt",
            message: "Do you need to manage anything else?"
        }
    ]).then(function(response) {
        if(response.prompt == true){
            promptManager();
        }
        else{
            connection.end();
        }
    })
}
function dataTable() {
    connection.query("Select * from products", function (err, res) {
        if(err) throw err;
        for (var i= 0; i < res.length; i ++){
            // console.log(res[0].id);
            var number = res[i].id;
            var name = res[i].product_name;
            var depName = res[i].department_name;
            var worth = res[i].price;
            var stock = res[i].stock_quantity;
            console.table([
                {
                    ID: number,
                    Product: name,
                    Department: depName,
                    Price: worth,
                    Quantity: stock
                }
            ]);
        }
        userContinue();
    })
    
}