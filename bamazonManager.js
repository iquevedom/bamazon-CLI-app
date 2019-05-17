var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
var userP = 0;
var userQ = 0;


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

// connect to the mysql server and sql database
connection.connect(function (err, res) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    /*  console.log(res); */
    /*  showProducts(); */
});

function main() {
    showProducts(menu);
}

function showProducts(callback) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline("\n----- Welcome to bamazon!!!. These are the products you can buy. -----\n"));
        console.table(res);
        console.log("\n");
        /*   connection.end(); */
        callback();
    });

};


// MAIN MENU : User selection prompt.
function menu() {
    /*     showProducts(); */
    inquirer
        .prompt([
            // User selection action.
            {
                type: "input",
                message: "Please enter the ID of the product you want to buy :",
                name: "userProduct",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                type: "input",
                message: "How many units you want to buy :",
                name: "userQty",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (itemResponse) {
            userP = itemResponse.userProduct;
            console.log("user wants to buy item number : ", userP);
            userQ = itemResponse.userQty;
            console.log("you wan to buy ", userQ, " items");
        });
};

main();

