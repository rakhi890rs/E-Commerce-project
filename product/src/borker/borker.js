const amqplib = require("amqplib");

let channel, connection;

async function connect() {
    if (connection && channel) return { connection, channel };

    try {
        connection = await amqplib.connect(process.env.RABBIT_URL);
        console.log("Connected to RabbitMQ");

        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err.message);
        });

        connection.on("close", () => {
            console.warn("RabbitMQ connection closed");
            channel = null;
            connection = null;
        });

        channel = await connection.createChannel();

        channel.on("error", (err) => {
            console.error("RabbitMQ channel error:", err.message);
        });

        channel.on("close", () => {
            console.warn("RabbitMQ channel closed");
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