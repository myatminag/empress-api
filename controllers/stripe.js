import Stripe from "stripe";

import Order from "../models/order.js";

const stripe = Stripe(process.env.STRIPE_KEY);

export const stripePayment = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            const error = new Error('No order is found on this ID!');
            error.statusCode = 404;
            throw error;
        };

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email: req.body.email
            }
        };

        const updateOrder = await order.save();

        const customer = await stripe.customers.create({
            metadata: {
                userId: req.body.userId,
            },
        });

        const line_items = req.body.orderItems.map((item) => { 
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        images: [item.image],
                        description: item.desc,
                        metadata: {
                            id: item.id,
                        },
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({ 
            payment_method_types: ["card"],
            line_items,
            mode: 'payment',
            customer: customer.id,
            success_url: `https://empress.vercel.app/checkout-success`,
            cancel_url: `https://empress.vercel.app/order`,
        });
    
        res.status(200).send({ url: session.url }).json({
            message: "Successfully Paid",
            order: updateOrder
        });
    } catch (error) { 
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};