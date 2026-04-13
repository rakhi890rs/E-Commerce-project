const { subscribeToQueue } = require("./borker");
const sendEmail = require("../email");

function setListeners() {

    // USER REGISTER EVENT
    subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
        const emailHTMLTemplate = `
            <h1>Welcome to our platform, ${data.fullname.firstname} ${data.fullname.lastname || ""}!</h1>
            <p>Thank you for registering with us. We're excited to have you on board.</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p>Best regards,<br/>The Team</p>
        `;

        await sendEmail(
            data.email,
            "Welcome to Our Platform",
            emailHTMLTemplate
        );
    });

    // PAYMENT COMPLETED EVENT
    subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {
        console.log("Received payment completed event:", data);

        const paymentHTMLTemplate = `
            <h1>Payment Successful 🎉</h1>
            <p>Your payment has been completed successfully.</p>
            
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Payment ID:</strong> ${data.paymentId}</p>
            <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
            <p><strong>Status:</strong> ${data.status}</p>

            <p>Thank you for shopping with us ❤️</p>
        `;

        await sendEmail(
            data.email,
            "Payment Successful",
            paymentHTMLTemplate
        );
    });
}

module.exports = setListeners;