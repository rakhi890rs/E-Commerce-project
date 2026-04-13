const express = require("express");
const { connect }   = require("./borker/borker");


const app = express();


connect();  

app.get("/", (req, res) => {
    res.send("Notification service is running");
});



module.exports = app;



