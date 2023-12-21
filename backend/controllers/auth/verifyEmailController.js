import expressAsyncHandler from 'express-async-handler';

import User from '../../models/user.js';
import VerifyResetToken from '../../models/verifyResetToken.js';
import { errorResponse } from '../../helpers/responseHelper.js';
import sendEmail from '../../utils/sendEmail.js';

const domainUrl = process.env.DOMAIN;

// $-title   Verify registered User Email Address
// $-path    GET /api/v1/auth/verify/:emailToken/:userId
// $-auth    Public
const verifyUserEmail = expressAsyncHandler(async (req, res) => {
  const {userId, emailToken} = req.params;
  const user = await User.findOne({ _id: userId }).select(
    '-password'
  );
  if (!user) errorResponse(res, 'User does not exist!');

  if (user.isEmailVerified)
    errorResponse(res, 'User already verified. Kindly login!');

  const userToken = await VerifyResetToken.findOne({
    _userId: user._id,
    token: emailToken,
  });

  if (!userToken) errorResponse(res, 'Invalid Token. Token may have expired!');

  user.isEmailVerified = true;

  await user.save();

  const emailLink = `${domainUrl}/login`;
  const templatePayload = {
    name: user.firstName,
    link: emailLink,
  };

  await sendEmail(
    user.email,
    'Welcome - Acount verified!',
    templatePayload,
    './emails/templates/welcome.handlebars'
  );

  return res.redirect('/auth/verify');
});

export default verifyUserEmail;
