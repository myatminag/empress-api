import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import { config } from "./config/db.js"; 
import Log from "./utils/log.js";
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import itemsRoute from './routes/item.js';
import orderRouter from './routes/order.js';
import uploadRouter from './routes/uploadImage.js'; 
import stripeRouter from './routes/stripe.js';

dotenv.config();

const app = express();
  
app.use(express.json());
 
app.use(cors()); 

app.get('/', (req, res, next) => {
    res.send('Server is running...');
});

// Routes
app.use('/server/upload', uploadRouter);

app.use('/server/auth', authRoute);

app.use('/server/items', itemsRoute);

app.use('/server/user', userRoute);

app.use('/server/orders', orderRouter); 

app.use('/server/payment', stripeRouter);

// Paypal
app.get('/server/keys/paypal', (req, res, next) => { 
    res.send(process.env.PAYPAL_CLIENT_ID || 'sendbox')
});

// Connect Mongodb
mongoose
    .set('strictQuery', false)
    .connect(config.mongo.url)
    .then(() => {
        Log.info('Connected Mongodb'); 
    })
    .catch((error) => {
        Log.error(error);
    })

// Server
app.listen(process.env.PORT || 4000 , () => {
    Log.info(`Server running on ${process.env.PORT}`); 
});