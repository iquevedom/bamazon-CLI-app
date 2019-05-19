var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3307,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// connect to the mysql server and sql database and execute main menu
connection.connect(function (err, res) {
    if (err) throw err;
    mainMenu();
});

function departmentSales () {

}

function mainMenu() {
    // MAIN  MENU : Supervisor selection prompt.
    uAction = "x";
    console.log("\n Welcome to bamazon Supervisor Menu \n")
    inquirer
        .prompt(
            // Supervisor choose the option to perform.
            {
                name: "action",
                type: "list",
                message: "What do you want to do:",
                choices: [
                    "View Product Sales by Department",
                    "View Sales by Product",
                    "Add to Inventory",
                    "Create New Department",
                    "exit"
                ]
            })
        .then(function (answer) {
            uAction = answer.action;
            switch (answer.action) {
                case "View Product Sales by Department":
                    departmentSales();
                    break
                case "View Low Inventory":
          /*           lowInventory(); */
                    break
                case "Add to Inventory":
     /*                getPidQty(uAction); */
                    break
                case "Add New Product":
        /*             getPidQty(uAction); */
                    break
                case "exit":
                    connection.end();
                    break
            }
        });
}
