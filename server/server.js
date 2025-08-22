import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {inngest,functions} from './inngest/index.js'
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js';
import serverless from "serverless-http";

const app = express();

await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get('/', (req, res)=> res.send('Server is running'))
app.use("/api/inngest", serve({ client: inngest, functions }))
app.use('/api/user', userRouter)

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}


export const handler = serverless(app);
export default app;