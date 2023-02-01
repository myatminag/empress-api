export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res
            .status(401)
            .json({
                message: "You are NOT authorized!"
            })
    }
};