const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');
const { pool, deleteTransactionById } = require('./TransactionService');
const { deleteAllTransactions } = require('./TransactionService');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =======================================================

//Health Checking
app.get('/health',(req,res)=>{
    res.json("This is the health check");
});
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});


// ADD TRANSACTION
app.post('/transaction', (req,res)=>{
    var response = "";
    try{
        console.log(req.body);
        console.log(req.body.amount);
        console.log(req.body.desc);
        var success = transactionService.addTransaction(req.body.amount,req.body.desc);
        if (success = 200) res.json({ message: 'added transaction successfully'});
    }catch (err){
        res.json({ message: 'something went wrong', error : err.message});
    }
});

// GET ALL TRANSACTIONS
app.get('/transaction',(req,res)=>{
    try{
        var transactionList = [];
       transactionService.getAllTransactions(function (results) {
            console.log("we are in the call back:");
            for (const row of results) {
                transactionList.push({ "id": row.id, "amount": row.amount, "description": row.description });
            }
            console.log(transactionList);
            res.statusCode = 200;
            res.json({"result":transactionList});
        });
    }catch (err){
        res.json({message:"could not get all transactions",error: err.message});
    }
});

//DELETE ALL TRANSACTIONS
app.delete('/transaction',(req,res)=>{
    try{
        transactionService.deleteAllTransactions(function(result){
            res.statusCode = 200;
            res.json({message:"delete function execution finished."})
        })
    }catch (err){
        res.json({message: "Deleting all transactions may have failed.", error:err.message});
    }
});

//DELETE ONE TRANSACTION
app.delete('/transaction/:id', (req, res) => {
    const id = req.params.id;
    
    pool.query(`DELETE FROM transactions WHERE id = ?`, [id], (err, result) => {
        if (err) {
            console.error("Error deleting transaction:", err);
            res.status(500).json({ error: "Error deleting transaction" });
        } else {
            res.json({ message: `Transaction with ID ${id} deleted successfully` });
        }
    });
});

//GET SINGLE TRANSACTION
app.get('/transaction/id',(req,res)=>{
    //also probably do some kind of parameter checking here
    try{
        transactionService.findTransactionById(req.body.id,function(result){
            res.statusCode = 200;
            var id = result[0].id;
            var amt = result[0].amount;
            var desc= result[0].desc;
            res.json({"id":id,"amount":amt,"desc":desc});
        });

    }catch(err){
        res.json({message:"error retrieving transaction", error: err.message});
    }
});

  app.listen(port, "0.0.0.0", () => {
    console.log(`AB3 backend app listening at http://backend:${port}`)
  })
