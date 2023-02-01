import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decode) => {
            if (error) {
                res
                    .status(401)
                    .json({
                        message: "Invalid Token"
                    })
            } else {
                req.user = decode;
                next();
            }
        })
    } else {
        res
            .status(401)
            .json({
                message: "NO Token"
            })
    }
};