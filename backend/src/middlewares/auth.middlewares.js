import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

// Unified auth middleware. Looks for token in cookie `jwt` or Authorization: Bearer header.
export const authorize = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : undefined;
        const token = req.cookies?.jwt || bearer;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
}
