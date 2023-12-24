import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import { systemLogs } from '../../utils/logger.js';
import { errorResponse } from '../../helpers/responseHelper.js';
import { ISDEV } from '../../constants/index.js';

// $-title  Login user, get access and refresh tokens
// $-path   POST  /api/v1/auth/login
// $-auth   Public
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    errorResponse(res, 'Please provide email and password!');

  const existingUser = await User.findOne({ email }).select('+password');

  if (!existingUser || !(await existingUser.comparePassword(password))) {
    errorResponse(res, 'Incorrect email and/or password', 401);
    systemLogs.error('Invalid Email and/or Password!');
  }

  if (!existingUser.isEmailVerified)
    errorResponse(res, 'User email Address not verified', 400);

  if (!existingUser.isActive)
    errorResponse(
      res,
      'User deactivated by administration. Contact support for queries'
    );

  const accessToken = jwt.sign(
    { id: existingUser._id, roles: existingUser.roles },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: ISDEV ? '1h' : '15m' }
  );
  const newRefreshToken = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: ISDEV ? '1d' : '2d' }
  );

  const cookies = req.cookies;

  let newRTArray = !cookies?.jwt
    ? existingUser?.refreshToken
    : existingUser.refreshToken.filter((rt) => rt !== cookies.jwt);

  const options = {
    httpOnly: true,
    maxAge: (ISDEV ? 24 : 48) * 60 * 60 * 1000,
    secure: true,
    sameSite: 'None',
  };

  if (cookies?.jwt) {
    const existingRefreshToken = await User.findOne({
      refreshToken: cookies.jwt,
    }).exec();

    if (!existingRefreshToken) newRTArray = [];

    res.clearCookie('jwt', options);
  }

  existingUser.refreshToken = [...newRTArray, newRefreshToken];
  await existingUser.save();

  res.cookie('jwt', newRefreshToken, options);

  return res.json({
    success: true,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    username: existingUser.username,
    email: existingUser.email,
    provider: existingUser.provider,
    roles: existingUser.roles,
    accessToken,
  });
});

export default loginUser;
