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
    /* Performs Sales by department report */
    connection.query("SELECT department_name, SUM(product_sales) AS sales FROM PRODUCTS GROUP BY department_name ORDER BY department_name ASC", function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline("\n----- Sales by Department Report. -----\n"));
        console.table(res);
        console.log("\n");
        mainMenu();
    })
};

function productSales () {
    /* Performs Sales by product report */
    connection.query("SELECT product_name, SUM(product_sales) AS sales FROM PRODUCTS GROUP BY product_name ORDER BY product_name ASC", function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline("\n----- Sales by Product Report. -----\n"));
        console.table(res);
        console.log("\n");
        mainMenu();
    })
};

function newDepartment(){

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
                case "View Sales by Product":
                     productSales(); 
                    break
                case "Add New Department":
                    newDepartment();
                    break
                case "exit":
                    connection.end();
                    break
            }
        });
}
