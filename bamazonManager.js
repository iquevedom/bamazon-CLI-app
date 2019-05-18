var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
var userP = 0;
var userQ = 0;
// divider will be used when neccesary
var divider = "\n------------------------------------------------------------\n\n";


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
    main();
});

// Main menu
function main() {
    showProducts(menu);
}

// Display of items to sale
function showProducts(callback) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline("----- Welcome to bamazon!!!. These are the products you can buy. -----\n"));
        console.table(res);
        console.log("\n");
        callback();
    });

};

// Ask to user if wants to continue
function askContinue() {
    inquirer
        .prompt({
            name: "cont",
            type: "list",
            message: "------ Would you like to continue? -----\n",
            choices: ["YES", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.cont === "YES") {
                main();
            } else {
                // Exit app
                connection.end();
            }
        });

};

// Search of the product the user wants to buy, check if exists
//check if theres is sufficient stock, and updates products table
function searchProduct(callback, userP, userQ) {
    connection.query("SELECT * FROM products where ?",
        [{
            item_id: userP
        }],
        function (err, res) {
            if (err) throw err;
            if (!(res[0])) {
                // It is not a valid item
                console.log(chalk.white.bgRed.bold("\nPlease enter a valid item id------\n"));
                callback();
            } else {
                // is there enough stock?
                if (parseInt(res[0].stock_quantity) < parseInt(userQ)) {
                    console.log(chalk.white.bgRed.bold("\nInsufficient quantity!------\n"));
                    callback();
                } else {
                    // Display total amount of purchase and updates products table
                    console.log(chalk.white.bgBlue.bold("\n------ Your total purchase is : ", parseInt(userQ) * parseInt(res[0].price), "------\n"));
                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: parseInt(res[0].stock_quantity) - parseInt(userQ)
                        },
                        {
                            item_id: parseInt(userP)
                        }],
                        function (error, res) {
                            if (error) { throw err; }
                        }
                    )
                    callback()
                }
            }

        }
    )
}

// MAIN MENU : User selection prompt.
function menu() {
    inquirer
        .prompt([
            // User enter the id of the product.
            {
                type: "input",
                message: "------  Please enter the ID of the product you want to buy :",
                name: "userProduct",
                // is a number validation
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                // User enter the qty that wants to buy
                type: "input",
                message: "------ How many units you want to buy :",
                name: "userQty",
                // is a number validation
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (itemResponse) {
            // Set the user choices in variables
            userP = itemResponse.userProduct;
            userQ = itemResponse.userQty;
            // Cal the function searchProduct and send the user choices
            searchProduct(askContinue, userP, userQ);
        });
}