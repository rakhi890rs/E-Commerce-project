const { subscribeToQueue } = require("./borker");
const sendEmail = require("../email");

function setListeners() {
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
}

module.exports = setListeners;