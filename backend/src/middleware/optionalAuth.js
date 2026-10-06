import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

/**
 * Like `auth`, but never rejects: it attaches `req.admin` when a valid admin
 * token is present and otherwise just continues as an anonymous request.
 *
 * Used on the public list endpoints so a logged-in admin sees the full
 * collection — including deactivated and draft items — while the public still
 * only ever sees published, active content. Without this the admin would be
 * unable to find an item it had just deactivated, which makes those toggles
 * one-way.
 *
 * A missing or invalid token is not an error here; the request is simply
 * treated as anonymous.
 */
const optionalAuth = async (req, _res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (admin && admin.isActive) req.admin = admin;
  } catch {
    // Treat any token problem as an anonymous request.
  }

  next();
};

export default optionalAuth;
