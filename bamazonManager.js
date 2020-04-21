var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');
var chalk = require('chalk');

var connection = mysql.createConnection({
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
                readStore();
                // dataTable();
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
function readStore() {
    connection.query("Select * from products", function (err, data) {
        if (err) throw err;

        console.log(data);
        userContinue();
    })
};
function lowStock() {
    connection.query("Select * from products where stock_quantity<=3", function (err, res) {
        if (err) throw err;
        console.log(res);
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
        connection.query("Select stock_quantity, price, product_name from products where ?", { id: data.id}, function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                // console.log(res[i].stock_quantity);
                // console.log(data.unit);
            
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
    var table = new Table({ head: ["ID", "Product Name", "Department Name", "Price", "Quantity in Stock"] });
 
table.push(
    { 'Left Header 1': ['Value Row 1 Col 1', 'Value Row 1 Col 2'] }
  , { 'Left Header 2': ['Value Row 2 Col 1', 'Value Row 2 Col 2'] }
);
 
console.log(table.toString());
}