const { Server } = require("socket.io");
const cookie = require('cookie');
const jwt = require('jsonwebtoken');


async function initSocketServer(httpServer) {
    const io = new Server(httpServer, {  });

    // middleware
    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        const token = cookies ? cookie.parse(cookies).token : null;
        if (!token) {
            return next(new Error('Unauthorized: No token provided'));
        }
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            return next(new Error('Unauthorized: Invalid token'));

        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
});

}


module.exports = initSocketServer;