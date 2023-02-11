import bcrypt from 'bcrypt';

import User from "../models/user.js";
import { generateToken } from '../utils/generateToken.js'; 
import errorResponse from '../utils/errorResponse.js';

// Get All Users (Admin)
let USER_LIST_PER_PAGE = 9;

export const getAllUsers = async (req, res, next) => {
    try {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || USER_LIST_PER_PAGE;

        const usersList = await User
            .find()
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const countUsersList = await User.countDocuments();

        res
            .status(200)
            .json({
                usersList,
                countUsersList,
                page,
                pages: Math.ceil(countUsersList / pageSize)
            })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Delete User (Admin)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new errorResponse("A user with this ID could not be found!", 404));
        } else {
            if (user.email === 'admin@admin.com') {
                res
                    .status(400)
                    .json({
                        message: "Unable to delete Admin Account!"
                    })
            };

            await user.remove();
    
            res
                .status(200)
                .json({
                    message: "Successfully Deleted!"
                })
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Update Profile 
export const updateProfle = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new errorResponse("A user with this ID could not be found!", 404));
        } else {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
    
            if (req.body.password) {
                user.password === bcrypt.hashSync(req.body.password, 12);
            }
            const updatedUser = await user.save();
            res
                .status(200)
                .json({
                    success: true,
                    token: generateToken(updatedUser),
                    user: {
                        _id: updatedUser._id,
                        username: updatedUser.username,
                        email: updatedUser.email,
                        isAdmin: updatedUser.isAdmin,
                    }
                })
        };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};