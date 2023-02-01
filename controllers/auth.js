import bcrypt from 'bcrypt';
import crypto from 'crypto';

import User from "../models/user.js";
import errorResponse from '../utils/errorResponse.js';
import { generateToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendMail.js';  

// Signup
export const signup = async (req, res, next) => { 

    const { username, email, password, cpassword } = req.body;

    if (!username || !email || !password || !cpassword ) {
        return next(new errorResponse("Please provide all fields", 400));
    };

    const exitingUser = await User.findOne({ email: email });

    if (exitingUser) {
        return next(new errorResponse("Email already exists!", 400));
    } else if (password !== cpassword) {
        return next(new errorResponse("Password confirmation does not match!", 400)); 
    } else {
        try {
            const newUser = new User({
                username, email, password, cpassword 
            });

            // hash password
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(newUser.password, salt);
            newUser.password = hash;
            newUser.cpassword = hash;
    
            const registeredUser = await newUser.save();
    
            res
                .status(200)
                .json({
                    success: true,
                    user: {
                        _id: registeredUser._id,
                        username: registeredUser.username,
                        email: registeredUser.email,
                        isAdmin: registeredUser.isAdmin,
                        token: generateToken(registeredUser)
                    }
                })
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500; 
            }
            next(error);
        }
    }
};

// Login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return next(new errorResponse("Please provide all fields", 400));
        };
    
        const user = await User.findOne({ email }); 
    
        if (!user) {
            return next(new errorResponse("A user with this email could not be found!", 400));
        } else {
            const isMatched = await bcrypt.compare(password, user.password);
    
            if (!isMatched) {
                return next(new errorResponse("Invalid Password!", 401));
            }
    
            res.status(201).json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user)
                }
            })
        }
    } catch (error) {
        if (!error.statusCode) { 
            error.statusCode = 500;
        }
        next(error);
    } 
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {  
    try {
        const { email } = req.body;
    
        if (!email) {
            return next(new errorResponse("Invalid Email", 400));
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return next(new errorResponse("Email cannot be sent!", 404));
        }

        const buffer = crypto.randomBytes(20);
        const resetToken = buffer.toString('hex');

        existingUser.resetPasswordToken = resetToken;
        existingUser.resetPasswordExpire = Date.now() +  10 * (60 * 1000); // 10 Minutes

        existingUser.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        const message = `
            <h1>Password Reset</h1>
            <p>
                We have send url to reset your password.
            </p>
            <a href=${resetUrl}>${resetUrl}</a>
            <p>
                Thanks for supporting us.
            </p> 
        `;

        try {
            sendEmail({
                to: existingUser.email,
                subject: "Reset Password",
                text: message
            });

            res.status(201).json({
                success: true
            })
        } catch (error) {
            existingUser.resetPasswordToken = undefined;
            existingUser.resetPasswordExpire = undefined;

            await existingUser.save();

            return next(new errorResponse("Mail cannot be sent!", 500))  
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
    
        if (!password) {
            return next(new errorResponse("Please provide a password!", 400));
        };

        const resetUser = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!resetUser) {
            return next(new errorResponse("Invalid User", 400));
        };

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        resetUser.password = hash;
        resetUser.resetPasswordToken = undefined;
        resetUser.resetPasswordExpire = undefined;

        await resetUser.save();

        const token = generateToken(resetUser);

        res.status(201).json({
            success: true,
            token
        })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};