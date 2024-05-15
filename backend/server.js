import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoute from './routes/uploadRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

import connectDB from './config/db.js';

const port = process.env.PORT || 8000;

connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie Parser Middlerware
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoute);

app.get("/api/config/paypal", (req,res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}));

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, '/uploads')));

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/ui/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'ui', 'build', 'index.html'))
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    })
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));