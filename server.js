import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './src/routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors()); // Respond to preflight requests
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); 
  next();
});



// Routes
app.use(`/auth/${process.env.VERSION}`, authRouter);


process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});