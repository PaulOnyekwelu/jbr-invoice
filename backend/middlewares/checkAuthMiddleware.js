import expressAsyncHandler from 'express-async-handler';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const checkAuth = expressAsyncHandler((req, res, next) => {
  let jwt_token;

  const authHeader = req?.headers?.authorization || req?.headers?.Authorization;

  if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);

  jwt_token = authHeader.split(' ')[1];

  jwt.verify(
    jwt_token,
    process.env.JWT_ACCESS_SECRET_KEY,
    async (err, decoded) => {
      if (err) return res.sendStatus(403);

      req.user = User.findById(decoded.id).select('-password');
      req.roles = decoded.roles;
      next();
    }
  );
});

export default checkAuth;
