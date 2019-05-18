module.exports = {
    showProducts : function (callback) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            console.log(chalk.red.white.underline("\n----- Welcome to bamazon!!!. These are the products you can buy. -----\n"));
            console.table(res);
            console.log("\n");
            callback();
        });
    }
};