const config = require('./DbConfig');
const mysql = require('mysql2');


const pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    port: config.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
function addTransaction(amount,desc){
    var mysql = `INSERT INTO \`transactions\` (\`amount\`, \`description\`) VALUES ('${amount}','${desc}')`;
    pool.query(mysql, function(err,result){
        if (err) throw err;
        console.log("Adding to the table should have worked");
    }) 
    return 200;
}

function getAllTransactions(callback){
    var mysql = "SELECT * FROM transactions";
    pool.query(mysql, function(err,result){
        if (err) throw err;
        console.log("Getting all transactions...");
        return(callback(result));
    });
}

function findTransactionById(id,callback){
    var mysql = `SELECT * FROM transactions WHERE id = ${id}`;
    pool.query(mysql, function(err,result){
        if (err) throw err;
        console.log(`retrieving transactions with id ${id}`);
        return(callback(result));
    }) 
}

function deleteAllTransactions(callback){
    var mysqlDelete = "DELETE FROM transactions";
    var mysqlReset = "ALTER TABLE transactions AUTO_INCREMENT = 1";

    pool.query(mysqlDelete, function (err, result) {
        if (err) {
            console.error("Error deleting transactions:", err);
            callback(err, null);
            return;
        }
        console.log("All transactions deleted");

        // Reset the auto-increment
        pool.query(mysqlReset, function (err, result) {
            if (err) {
                console.error("Error resetting auto-increment:", err);
                callback(err, null);
                return;
            }
            console.log("Auto-increment reset to 1");
            callback(null, result);
        });
    });
}

function deleteTransactionById(id, callback){
    var mysql = `DELETE FROM transactions WHERE id = ${id}`;
    pool.query(mysql, function(err,result){
        if (err) throw err;
        console.log(`Deleting transactions with id ${id}`);
        return(callback(result));
    }) 
}


module.exports = {pool,addTransaction ,getAllTransactions, deleteAllTransactions, deleteAllTransactions, findTransactionById, deleteTransactionById};