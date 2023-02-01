import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    deliveryAddress: { 
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        addressState: {
            type: String, 
            required: true 
        },
    },
    orderItems: [
        {
            brand: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            modelName: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true,
            },
            item: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Item",
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    paymentResult: {
        id: {
            type: String,
        },
        status: {
            type: String,
        },
        update_time: {
            type: String
        },
        email: {
            type: String
        }
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0
    },
    deliveryPrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

export default Order;