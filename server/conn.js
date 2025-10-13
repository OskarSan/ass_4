import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbManagerRouter from './dbManager.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:1234" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.resolve(__dirname, '../client');

app.use(express.static(clientDir));

app.use("/api/dbManager", dbManagerRouter);


app.get('/', (req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});