const { subscribeToQueue } = require("../borker/borker");







module.exports = function() {
    subscribeToQueue("order_created", async (data) => {
        console.log("Processing order created event:", data);
    });
};