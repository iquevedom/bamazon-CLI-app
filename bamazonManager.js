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
    if (err) throw err
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
        callback();
    });

};

function askContinue() {
    inquirer
        .prompt({
            name: "cont",
            type: "list",
            message: "Would you like to continue?",
            choices: ["yes", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.cont === "yes") {
                main();
            } else {
                connection.end();
            }
        });

};


function searchProduct(callback, userP, userQ) {
    connection.query("SELECT * FROM products where ?",
        [
            {
                item_id: userP
            }
        ],
        function (err, res) {
            if (err) throw err;
            if (parseInt(res[0].stock_quantity) < parseInt(userQ)) {
                console.log("Insufficient quantity!");
                callback();
            } else {
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity:  parseInt(res[0].stock_quantity) -  parseInt(userQ)
                        },
                        {
                            item_id: parseInt(userP)
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                    }
                );
                console.log("Your total purchase is : ", parseInt(userQ) * parseInt(res[0].price));
                callback();
            };
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
             userQ = itemResponse.userQty;
            searchProduct(askContinue, userP, userQ);
        });
};

main();

