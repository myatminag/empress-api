import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true 
    },
}, { timestamps: true })
 
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    modelName: {
        type: String,
        required: true,
    },
    brand: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    images: [
        String
    ],
    inStock: {
        type: Number,
        required: true,
    },
    numberOfReviews: {
        type: Number,
        default: 0,
        required: true
    },
    reviews: [reviewSchema]
}, { timestamps: true });

const Item = mongoose.model("Item", ItemSchema);

export default Item;