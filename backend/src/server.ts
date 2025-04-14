import express, { Request, Response } from 'express'
import dotven from 'dotenv'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
dotven.config()
import userRouter from './routes/user.routes'

// Create server
const app = express()

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', userRouter);

// Create HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4321', // Astro
    methods: ["GET", "POST"]
  }
});

// Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send("Invalid route!")
})

// Start server
const MONGO_URI = process.env.DATABASE_URL!
mongoose
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