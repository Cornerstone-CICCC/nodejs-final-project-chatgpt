import express, { Request, Response } from 'express';
import dotven from 'dotenv';
dotven.config()

// Create server
const app = express()

// Middleware
app.use(express.json())

// Routes

// Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send("Invalid route!")
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`)
})