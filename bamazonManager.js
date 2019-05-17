var mysql = require("mysql");
var inquirer = require("inquirer");


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
});

function showProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
/*          console.log(res); */
         console.table(res); 
        connection.end();
    });
};

showProducts();


