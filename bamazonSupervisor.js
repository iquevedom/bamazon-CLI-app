var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');

var newDName = "";

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

function departmentSales() {
    /* Performs Sales by department report */
    connection.query("SELECT department_name AS 'Department Name', SUM(product_sales) AS Sales FROM PRODUCTS GROUP BY department_name ORDER BY department_name ASC", function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline("\n----- Sales by Department Report. -----\n"));
        console.table(res);
        console.log("\n");
        mainMenu();
    })
};

function productSales() {
    /* Performs Sales by product report */
    connection.query("SELECT product_name AS 'Product Name', SUM(product_sales) AS Sales FROM PRODUCTS GROUP BY product_name ORDER BY product_name ASC", function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline("\n----- Sales by Product Report. -----\n"));
        console.table(res);
        console.log("\n");
        mainMenu();
    })
};

let showDepartments = function(callback) {
    /* Performs actual departments report */
    connection.query("SELECT department_id AS 'Department Id', department_name AS 'Department Name' FROM departments ORDER BY department_id", function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline("\n----- Actual departments report. -----\n"));
        console.table(res);
        console.log("\n");
        callback();
    })
}

// Prompt to get product id and qty
let getPidQty =
    function (callback) {
        inquirer
            .prompt(
                // User enter the id of the product.
                [{
                    type: "input",
                    message: "------  Enter the new department's name :",
                    name: "dName",
                    // is a number validation
                }]
            )
            .then(function (itemResponse) {
                // Set the user choices in variables
                newDName = itemResponse.dName;
                callback();
            });
    };

function newDepartment() {
    /* getPidQty(newDName); */
    
    var newDQuery = 'INSERT INTO departments (department_name) VALUES ("' + newDName + '");';
    connection.query(newDQuery,
        function (error, res) {
            if (error) { console.log(error); console.log(connection.query) }
            else {
                console.log(chalk.white.bgBlue("\nThe new department ", " has been added!!\n"));
            }
        });
        showDepartments(mainMenu);
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
                case "Create New Department":
                    getPidQty(newDepartment);
                    break
                case "exit":
                    connection.end();
                    break
            }
        });
}
