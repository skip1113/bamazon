const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
require('console.table');
//Making a connection to Mysql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
connection.connect(function(err) {
    if(err) throw err;
    console.log("You've connected as ID " +connection.threadId + "\n");
    startCustomer();
})

function startCustomer() {
    console.log(chalk.yellow("\n==========================================="));
    console.log(chalk.yellow("=       Welcome to B-B-B-Bamazon!         ="));
    console.log(chalk.yellow("===========================================\n"));
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do today?",
            choices: [
                "List Products",
                "Make a purchase from the store",
                "Exit"
            ]
        }
    ]).then(function(answer) {
        //if/else /switch cases for each prompt choice to call their function
        switch (answer.action) {
            case "List Products":
                dataTable();
                break;

            case "Make a purchase from the store":
                
                purchaseCustomer();
                break;
            
            
            case "Exit":
                connection.end();
                // break;
        }
    })
}
function purchaseCustomer() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What is the ID of the product that you would like to buy?"
        },
        {
            type: "input",
            name: "unit",
            message: "How many units of this product would you like to buy?"
        }
    ]).then(function(data) {
        console.log(chalk.cyan("You want item: " + data.id));
        console.log(chalk.cyan("You want this many: " + data.unit));
        //Selects the wanted values from the products table from Mysql
        connection.query("Select stock_quantity, price, product_name from products where ?", 
            { id: data.id}, function(err, res) {
                if (err) throw err;
                // userTable(data);
                for (var i = 0; i < res.length; i++) {
                    if (res[i].stock_quantity > parseInt(data.unit)) {
                        console.log(chalk.blueBright("Buying: " + res[i].product_name));
                        var newStock = res[i].stock_quantity - parseInt(data.unit);
                        var total = res[i].price * parseInt(data.unit);
                        // console.log(newStock);
                        //Updates the data of the specific id and specific quantity the user provides
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
                            function(error) {
                                if(error) throw error;
                                console.log(chalk.magenta("Item(s) Successfully bought!"));
                                console.log(chalk.magenta("Your total price is: $" + total));
                                userContinue();
                            }
                        )
                    }
                    else {
                        console.log(chalk.red("Insufficient quantity!"));
                        userContinue();
                    }
                }
            })
        
    })
}
function userContinue() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "prompt",
            message: "Would you like to keep Buying/Selling?"
        }
    ]).then(function(response) {
        if(response.prompt == true){
            startCustomer();
        }
        else{
            connection.end();
        }
    })
}
//Data table to show the user
function dataTable() {
    connection.query("Select * from products", function (err, res) {
        if(err) throw err;
        // for (var i= 0; i < res.length; i ++){
        //     // console.log(res[0].id);
        //     var number = res[i].id;
        //     var name = res[i].product_name;
        //     var depName = res[i].department_name;
        //     var worth = res[i].price;
        //     var stock = res[i].stock_quantity;
        //     console.table([
        //         {
        //             ID: number,
        //             Product: name,
        //             Department: depName,
        //             Price: worth,
        //             Quantity: stock
        //         }
        //     ]);
        // }
        console.table(res);
        startCustomer();
    })
}