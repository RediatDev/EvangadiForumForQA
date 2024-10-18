// roleMiddleware.js
const checkRole = (roles) => {
    return (req, res, next) => {
        console.log(req.user)
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = {checkRole};

// roles given
    // 1. user role = 0
    // 2. admin role = 1
    // 3. subAdmin role = 2