const amqplib = require("amqplib");

let channel, connection;

async function connect() {
    if (connection && channel) return { connection, channel };

    try {
        connection = await amqplib.connect(process.env.RABBIT_URL);
        console.log("Connected to RabbitMQ");

        connection.on("error", (error) => {
            console.error("RabbitMQ connection error:", error.message);
        });

        connection.on("close", () => {
            console.log("RabbitMQ connection closed");
            connection = null;
            channel = null;
        });

        channel = await connection.createChannel();

        channel.on("error", (error) => {
            console.error("RabbitMQ channel error:", error.message);
        });

        channel.on("close", () => {
            console.log("RabbitMQ channel closed");
        });

        return { connection, channel };
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
        throw error;
    }
}

async function publishToQueue(queueName, data) {
    if (!channel || !connection) await connect();

    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log(`Message sent to queue ${queueName}:`, data);
}

async function subscribeToQueue(queueName, callback) {
    if (!channel || !connection) await connect();

    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log(`Message received from queue ${queueName}:`, data);

                await callback(data);

                channel.ack(msg);
            } catch (error) {
                console.error("Error processing message:", error);
                channel.nack(msg, false, true);
            }
        }
    });
}

module.exports = {
    connect,
    publishToQueue,
    subscribeToQueue,
};