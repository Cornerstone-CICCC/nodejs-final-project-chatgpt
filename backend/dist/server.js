"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// Create server
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/user', user_routes_1.default);
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
    // chatSocket(io);
    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
