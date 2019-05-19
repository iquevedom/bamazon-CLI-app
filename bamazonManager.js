var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
var userP = 0;
var userQ = 0;
var uAction = "";
var userPp = "";
var userQq = "";
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
    mainMenu();
});

// Prompt to get product id and qty
let getPidQty =
    function (uAction) {
        inquirer
            .prompt(
                // User enter the id of the product.
                [{
                    type: "input",
                    message: "------  Please enter the ID of the product :",
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
                    message: "------ Please enter the product qty :",
                    name: "userQty",
                    // is a number validation
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }]
            )
            .then(function (itemResponse) {
                // Set the user choices in variables
                userP = itemResponse.userProduct;
                userQ = itemResponse.userQty;
                if (uAction === "View Products for Sale") {
                    searchProduct(userP, userQ)
                }
                else if (uAction === "Add to Inventory") {
                    addInventory();
                } else if (uAction === "Add New Product") {
                    newProduct(userP, userQ);
                }
            });
    };

// Display of items to sale
function showProducts() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline("\n----- Welcome to bamazon!!!. These are the products you can buy. -----\n"));
        console.table(res);
        console.log("\n");
        getPidQty(uAction);
    })
};

// Search of the product the user wants to buy, check if exists
//check if theres is sufficient stock, and updates products table
function searchProduct(userP, userQ) {
    connection.query("SELECT * FROM products where ?",
        [{
            item_id: userP
        }],
        function (err, res) {
            if (err) throw err;
            if (!(res[0])) {
                // It is not a valid item
                console.log(chalk.white.bgRed.bold("\nPlease enter a valid item id------\n"));
                mainMenu();
            } else {
                // is there enough stock?
                if (parseInt(res[0].stock_quantity) < parseInt(userQ)) {
                    console.log(chalk.white.bgRed.bold("\nInsufficient quantity!------\n"));
                    mainMenu();
                } else {
                    // Display total amount of purchase and updates products table
                    console.log(chalk.white.bgBlue.bold("\n------ Your total purchase is : ", parseInt(userQ) * parseInt(res[0].price), "------\n"));
                    connection.query("UPDATE products SET ?,? WHERE ?",
                        [{
                            stock_quantity: parseInt(res[0].stock_quantity) - parseInt(userQ)
                        },
                        {
                            product_sales: (res[0].product_sales + (parseInt(userQ) * parseInt(res[0].price)))
                        },
                        {
                            item_id: parseInt(userP)
                        }],
                        function (error, res) {
                            if (error) { throw err; }
                        }
                    )
                    mainMenu()
                }
            }

        }
    )
}

function lowInventory() {
    var query = "select item_id, product_name, department_name, stock_quantity from products where stock_quantity < 5 order by 1;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(chalk.red.white.underline(chalk.white.bold.bgRed("\n------------------- List of products with low inventory -------------------\n")));
        console.table(res);
        console.log("\n");
        mainMenu();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products where ?",
        [{
            item_id: userP
        }],
        function (err, res) {
            if (err) throw err;
            if (!(res[0])) {
                // It is not a valid item
                console.log(chalk.white.bgRed.bold("\nPlease enter a valid item id------\n"))
                mainMenu();
            } else {
                connection.query("UPDATE products SET ? WHERE ?",
                    [{
                        stock_quantity: parseInt(res[0].stock_quantity) + parseInt(userQ)
                    },
                    {
                        item_id: parseInt(userP)
                    }],
                    function (error, res) {
                        if (error) { throw err; }
                        console.log(chalk.white.bgBlue("\nThe product ", " has been updated!!\n"));
                        mainMenu();
                    });
            }
        });
}

function newProduct(userPp, userQq) {
    inquirer
        .prompt(
            // User enter the id of the product.
            [{
                type: "input",
                message: "------  Enter the product name :",
                name: "productName",
            },
            {
                // User enter the qty that wants to buy
                type: "input",
                message: "------ Enter the department name :",
                name: "departmentName",
            },
            {   // User enter the product price
                type: "input",
                message: "------  Enter the product price :",
                name: "productPrice",
                // is a number validation
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
            ]
        )
        .then(function (itemResponse) {
            // Set the user choices in variables
/*             userP = itemResponse.userProduct;
            userQ = itemResponse.userQty; */
            var resp = 'INSERT INTO products (item_id,product_name,department_name,price, stock_quantity) VALUES(' + userPp + ',' + '"' + itemResponse.productName + '","' + itemResponse.departmentName + '",' + itemResponse.productPrice + ',' + userQq + ')';
            connection.query(resp,
                function (error, res) {
                    if (error) { console.log(error); console.log(connection.query) }
                    else {
                        console.log(chalk.white.bgBlue("\nThe product ", " has been added!!\n"));
                        mainMenu();
                    }
                });
        })

}

// MAIN  MENU : User selection prompt.
function mainMenu() {
    uAction = "x";
    console.log("\n Welcome to bamazon \n")
    inquirer
        .prompt(
            // User choose an option.
            {
                name: "action",
                type: "list",
                message: "What do you want to do:",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "exit"
                ]
            })
        .then(function (answer) {
            uAction = answer.action;
            switch (answer.action) {
                case "View Products for Sale":
                    showProducts();
                    break
                case "View Low Inventory":
                    lowInventory();
                    break
                case "Add to Inventory":
                    getPidQty(uAction);
                    break
                case "Add New Product":
                    getPidQty(uAction);
                    break
                case "exit":
                    connection.end();
                    break
            }
        });
}