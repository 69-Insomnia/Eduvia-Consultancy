import Admin from '../models/Admin';
import asyncHandler from '../middleware/asyncHandler';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const admin = await Admin.unscoped().findOne({ where: { email } });
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!admin.isActive) {
    return res.status(401).json({ success: false, message: 'Account is deactivated' });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = admin.generateAuthToken();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('token', token, cookieOptions);

  res.json({
    success: true,
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
    },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.admin.id);
  res.json({ success: true, admin });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide current and new password' });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ success: false, message: 'New password must be at least 6 characters' });
  }

  const admin = await Admin.unscoped().findByPk(req.admin.id);
  const isMatch = await admin.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  admin.password = newPassword;
  await admin.save();

  const token = admin.generateAuthToken();
  res.json({ success: true, token, message: 'Password updated successfully' });
});
