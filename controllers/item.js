import Item from "../models/item.js";
import errorResponse from '../utils/errorResponse.js';

// Get All Item
export const getAllItem = async (req, res, next) => { 
    try {
        const items = await Item.find();
        if (!items) {
            return next(new errorResponse("No Items are found!", 404));
        } else {
            res
                .status(200)
                .json(items)
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Create New Item
export const createNewItem = async (req, res, next) => { 
    try {
        const newItem = new Item(req.body);
        const item = await newItem.save(); 

        res
            .status(200)
            .json({
                message: "Successfully Created",
                item
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Update Item
export const updateItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);

        if (!item) {
            return next(new errorResponse("No Item is found on this ID!", 404));
        } else {
            item.name = req.body.name;
            item.modelName = req.body.modelName;
            item.brand = req.body.brand;
            item.price = req.body.price;
            item.description = req.body.description;
            item.category = req.body.category;
            item.image = req.body.image;
            item.images = req.body.images;
            item.inStock = req.body.inStock;
    
            await item.save();
            
            res
                .status(200)
                .json({ message: "Item Updated" });
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Delete Item
export const deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return next(new errorResponse("No Item is found on this ID!", 404));
        } else {
            await item.remove();
            res
                .status(200)
                .json({
                    message: 'Successfully Deleted'
                })
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }  
        next(error);
    }
};

// Get Item Details
export const getItemDetails = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return next(new errorResponse("No Item is found on this ID!", 404));
        } else {
            res
                .status(200)
                .json(item)
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Get Item Brand
export const getBrands = async (req, res, next) => {
    try {
        const brands = await Item.find().distinct('brand');
        if (!brands) {
            return next(new errorResponse("No brand is found!", 404));
        } else {
            res
                .status(200)
                .json(brands);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Get Item Categories
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Item.find().distinct('category');
        if (!categories) {
            return next(new errorResponse("No category is found!", 404));
        } else {
            res
                .status(200)
                .json(categories);
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Search Item
const ITEMS_PER_PAGE = 8;

export const getSearchItem = async (req, res, next) => {
    try {
        const { query } = req;
        const pageSize = query.pageSize || ITEMS_PER_PAGE; 
        const page = query.page || 1;
        const category = query.category || '';
        const price = query.price || '';
        const order = query.order || '';
        const searchQuery = query.query || '';
        const brand = query.brand || '';

        const filterQuery = searchQuery && searchQuery !== 'all' ? { 
            name: {
                $regex: searchQuery,
                $options: 'i'
            }
        } : {};

        const filterBrand = brand && brand !== 'all' ? { brand } : {};

        const filterCategory = category && category !== 'all' ? { category } : {};

        const filterPrice = price && price !== 'all' ? {  
            price: {
                $gte: Number(price.split('-')[0]),
                $lte: Number(price.split('-')[1])
            }
        } : {};

        const sortOrder = order === 'featured' ? { featured: -1 } : 
            order === 'lowest' ? { price: 1 } :
            order === 'highest' ? {price: -1 } :
            order === 'toprated' ? { rating: -1 } :
            order === 'newest' ? { createdAt: -1 } : { _id: -1 }

        const items = await Item
            .find({
                ...filterBrand,
                ...filterCategory,
                ...filterQuery,
                ...filterPrice
            })
            .sort(sortOrder)
            .skip((page - 1) * pageSize)
            .limit(pageSize)

        const countItems = await Item.countDocuments({
            ...filterBrand,
            ...filterCategory,
            ...filterQuery,
            ...filterPrice
        })

        res
            .status(200)
            .json({
                items,
                countItems,
                page,
                pages: Math.ceil(countItems / pageSize)
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Get Item List (Admin)
let ITEM_LIST_PER_PAGE = 9;

export const getItemList = async (req, res, next) => {
    try {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || ITEM_LIST_PER_PAGE;

        const itemList = await Item
            .find()
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const countItemList = await Item.countDocuments();

        res
            .status(200)
            .json({
                itemList,
                countItemList,
                page,
                pages: Math.ceil(countItemList / pageSize)
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Post Reviews
export const postReview = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);

        if (!item) {
            return next(new errorResponse("No Item is found on this ID!", 404));
        } else {
            if (item.reviews.find((client) => client.username === req.user.username)) {
                return res
                    .status(400)
                    .json({
                        message: "You have already submitted a review"
                    })
            }
     
            const review = { 
                username: req.user.username, 
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
    
            item.reviews.push(review);
            item.numberOfReviews = item.reviews.length;
            item.rating = item.reviews.reduce((accu, curRate) => curRate.rating + accu, 0) / item.reviews.length;
    
            const updateItem = await item.save();
            res
                .status(200)
                .json({
                    message: "Post Review",
                    review: updateItem.reviews[updateItem.reviews.length - 1],
                    numberOfReviews: item.numberOfReviews,
                    rating: item.rating
                })
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};