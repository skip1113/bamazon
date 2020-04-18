var mysql = require('mysql');
var inquirer = require('inquirer');
var keys = require("./pass.js");

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
    connection.end();
})
function startCustomer() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What is the ID of the product that you would like to buy?"
        },
        {
            type: "input",
            name: "unit",
            message: "How mnay units of this product would you like to buy?"
        }
    ]).then(function(data) {
        console.log(data.id);
        console.log(data.unit);
    })
}
startCustomer();