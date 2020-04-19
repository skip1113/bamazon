var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
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
    console.log("\n===========================================");
    console.log("=          Welcome to B-B-B-Bamazon!      =");
    console.log("===========================================\n");
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
        switch (answer.action) {
            case "List Products":
                readStore();
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
function readStore() {
    connection.query("Select * from products", function(err, data) {
        if (err) throw err;
        
        console.log(data);
        startCustomer();
        // connection.end();
    })
};

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
        console.log("You want item: " + data.id);
        console.log("You want this many: " + data.unit);
        connection.query("Select stock_quantity, price, product_name from products where ?", { id: data.id}, function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                // console.log(res[i].stock_quantity);
                // console.log(data.unit);
            
                if (res[i].stock_quantity > parseInt(data.unit)) {
                    console.log("buying now!");
                    var newStock = res[i].stock_quantity - parseInt(data.unit);
                    var total = res[i].price * parseInt(data.unit);
                    
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
                        function(error) {
                            if(error) throw error;
                            console.log("Item(s) Successfully bought!");
                            console.log("Your total price is: $" + total);
                            userContinue();
                        }
                    )
                }
                else {
                    console.log("Insufficient quantity!");
                    userContinue();
                }
            }
        })
        
    })
};

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
function sellProduct() {
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
        console.log("You want item: " + data.id);
        console.log("You want this many: " + data.unit);
        connection.query("Select stock_quantity, price from products where ?", { id: data.id}, function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].stock_quantity);
                console.log(data.unit);
            
                if (res[i].stock_quantity > parseInt(data.unit)) {
                    console.log("buying now!");
                    var newStock = res[i].stock_quantity - parseInt(data.unit);
                    var total = res[i].price * parseInt(data.unit);
                    
                    console.log(newStock);
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
                            console.log("Item(s) Successfully bought!");
                            console.log("Your total price is: $" + total);
                            userContinue();
                        }
                    )
                }
                else {
                    console.log("Insufficient quantity!");
                    userContinue();
                }
            }
        })
        
    })
};