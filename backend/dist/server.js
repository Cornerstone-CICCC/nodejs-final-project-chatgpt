"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const chat_socket_1 = __importDefault(require("./sockets/chat.socket"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const room_routes_1 = __importDefault(require("./routes/room.routes"));
const friend_routers_1 = __importDefault(require("./routes/friend.routers"));
// Create server
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:4321", // Astro port
    credentials: true // allow cookie transfer
}));
app.use(express_1.default.json());
const SIGN_KEY = process.env.COOKIE_SIGN_KEY;
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
if (!SIGN_KEY || !ENCRYPT_KEY) {
    throw new Error("Missing cookie keys!");
}
app.use((0, cookie_session_1.default)({
    name: 'session',
    keys: [SIGN_KEY, ENCRYPT_KEY],
    maxAge: 60 * 60 * 1000
}));
// Routes
app.use('/user', user_routes_1.default);
app.use('/chat', chat_routes_1.default);
app.use('/room', room_routes_1.default);
app.use('/friend', friend_routers_1.default);
// Create HTTP server and attach Socket.IO
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:4321', // Astro
        methods: ["GET", "POST"]
    },
});
// Fallback
app.use((req, res) => {
    res.status(404).send("Invalid route!");
});
// Start server
const MONGO_URI = process.env.DATABASE_URL;
mongoose_1.default
    .connect(MONGO_URI, { dbName: 'chatgpt' })
    .then(() => {
    console.log('Connected to MongoDB database');
    // // Start Socket.IO
    (0, chat_socket_1.default)(io);
    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
