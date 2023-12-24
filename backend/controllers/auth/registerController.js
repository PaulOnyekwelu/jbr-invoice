import expressAsyncHandler from 'express-async-handler';
import { randomBytes } from 'crypto';
import User from '../../models/user.js';
import sendEmail from '../../utils/sendEmail.js';
import VerifyResetToken from '../../models/verifyResetToken.js';
import { errorResponse } from '../../helpers/responseHelper.js';

const domainUrl = process.env.DOMAIN;

// $-title  Register User and send Email verification link
// $-path   POST /api/v1/auth/register
// $-auth   Public
const registerUser = expressAsyncHandler(async (req, res) => {
  const { email, username, password, passwordConfirm, firstName, lastName } =
    req.body;

  if (
    !email ||
    !username ||
    !password ||
    !passwordConfirm ||
    !firstName ||
    !lastName
  )
    errorResponse(res, 'Please provide all required fields!');

  // Already implemented in User Schema validation
  // if (password !== passwordConfirm) {
  //   res.status(400)
  //   throw new Error("Password does not match!")
  // }

  const userExist = await User.findOne({ email });

  if (userExist) errorResponse(res, 'Email associated with an existing user');

  const newUser = await new User({
    email,
    username,
    password,
    passwordConfirm,
    firstName,
    lastName,
  }).save();

  if (!newUser)
    errorResponse(
      res,
      'User registration could not be completed at the moment. Try again!'
    );

  const evToken = await new VerifyResetToken({
    _userId: newUser._id,
    token: randomBytes(32).toString('hex'),
  }).save();

  const emailLink = `${domainUrl}/api/v1/auth/verify/${evToken.token}/${newUser._id}`;
  const templatePayload = {
    name: newUser.firstName,
    link: emailLink,
  };
  await sendEmail(
    newUser.email,
    'Account Verification',
    templatePayload,
    './emails/templates/verifyEmail.handlebars'
  );

  return res.json({
    success: true,
    message:
      'Registration Successful. A message has been sent to the registered email for verification. Verification message expires in 15 minutes.',
  });
});

export default registerUser;
