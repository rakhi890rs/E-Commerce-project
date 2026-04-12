const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const agent = require("../agent/agent");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    const token = cookies ? cookie.parse(cookies).token : null;

    if (!token) {
      return next(new Error("Unauthorized: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      socket.token = token;
      next();
    } catch (error) {
      return next(new Error("Unauthorized: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", async (data) => {
      try {
        console.log("Socket token:", socket.token);
        console.log("Socket user:", socket.user);
        console.log("Incoming socket message:", data);

        const agentResponse = await agent.invoke(
          {
            messages: [
              {
                role: "user",
                content: data,
              },
            ],
          },
          {
            metadata: {
              token: socket.token,
            },
          }
        );

        console.log("Full agent response:", agentResponse);

        const lastMessage =
          agentResponse.messages[agentResponse.messages.length - 1];

        console.log("Last message:", lastMessage);
        console.log("Last message content:", lastMessage.content);

        const finalResponse =
          typeof lastMessage.content === "string"
            ? lastMessage.content
            : JSON.stringify(lastMessage.content);

        socket.emit("bot_response", finalResponse);
      } catch (error) {
        console.error(
          "Socket message error:",
          error.response?.data || error.message
        );

        socket.emit("bot_response", "Something went wrong");

        socket.emit("error", {
          message: error.response?.data?.message || error.message,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = initSocketServer;