require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

const startListener = require('./src/borker/listner');
const { connect }   = require('./src/borker/borker');

connectDB();

connect().then(() => {
    startListener();
}
).catch((err) => {
    console.error("Failed to connect to RabbitMQ:", err);
    process.exit(1);
});



app.listen(3007, () => {
  console.log('Seller service is running on port 3007');
}
);