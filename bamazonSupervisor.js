const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
require('console.table');
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
    promptSupervisor();
});

function promptSupervisor() {
    console.log(chalk.yellow("\n==========================================="));
    console.log(chalk.yellow("=       Welcome Supervisor!         ="));
    console.log(chalk.yellow("===========================================\n"));
    inquirer.prompt ([
        {
            type: "list",
            name: "action",
            message: "What would you like to do today?",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
                "Exit"
            ]
        }
    ]).then(function(answer) {
        switch (answer.action) {
            case "View Product Sales by Department":
                depTable();
            break;
            case "Create New Department":
                createNew();
            break;
            case "Exit":
                connection.end();
        }
    })
}
function depTable() {
    connection.query("Select * from departments", function (err, res) {
        if(err) throw err;
        for (var i = 0; i < res.length; i++) {
            var depId = res[i].department_id;
            var depName = res[i].department_name;
            var cost = res[i].over_head_cost;
            console.table([
                {
                    department_id: depId,
                    department_name: depName,
                    over_head_cost: cost
                }
            ])
        }
        promptSupervisor();
    })
};
function createNew() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department you would like to create?"
        },
        {
            type: "input",
            name: "cost",
            message: "What is the over head cost?"
        }
    ]).then(function(create) {
        connection.query("INSERT INTO departments SET ? ", 
        {
            department_name: create.name,
            over_head_cost: create.cost
        },function(err) {
            if(err) throw err;
            console.log(chalk.greenBright("New Department has been created!"));
            promptSupervisor();
        }
        )
    })
}
// Code to sell product for bamCustomer
// function sellProduct() {
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "id",
//             message: "What is the ID of the product that you would like to sell?"
//         },
//         {
//             type: "input",
//             name: "unit",
//             message: "How many units of this product would you like to sell?"
//         }
//     ]).then(function(data) {
//         console.log("You want item: " + data.id);
//         console.log("You want this many: " + data.unit);
//         connection.query("Select stock_quantity, price from products where ?", { id: data.id}, function(err, res) {
//             if (err) throw err;
//             for (var i = 0; i < res.length; i++) {
//                 console.log(res[i].stock_quantity);
//                 console.log(data.unit);
            
//                 if (res[i].stock_quantity > parseInt(data.unit)) {
//                     console.log("buying now!");
//                     var newStock = res[i].stock_quantity - parseInt(data.unit);
//                     var total = res[i].price * parseInt(data.unit);
                    
//                     console.log(newStock);
//                     connection.query(
//                         "UPDATE products set? where?",
//                         [
//                             {
//                                 stock_quantity: newStock
//                             },
//                             {
//                                 id: data.id
//                             }
//                         ],
//                         function(error) {
//                             if(error) throw error;
//                             console.log("Item(s) Successfully bought!");
//                             console.log("Your total price is: $" + total);
//                             userContinue();
//                         }
//                     )
//                 }
//                 else {
//                     console.log("Insufficient quantity!");
//                     userContinue();
//                 }
//             }
//         })
        
//     })
// };