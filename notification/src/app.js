const express = require("express");
const { connect }   = require("./borker/borker");
const setListeners = require("./borker/listners");

const app = express();

connect().then(() => {
const express = require("express");
const { connect } = require("./borker/borker");
const setListeners = require("./borker/listners");

const app = express();

connect()
    .then(() => {
        setListeners();
    })
    .catch((error) => {
        console.error("RabbitMQ connection failed:", error);
    });

app.get("/", (req, res) => {
    res.send("Notification service is running");
});

module.exports = app;});

app.get("/", (req, res) => {
    res.status(200).json({ message: "Notification Service is up and running" });
});

module.exports = app;