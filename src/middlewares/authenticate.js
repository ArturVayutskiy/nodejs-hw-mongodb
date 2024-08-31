import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import console from 'console';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    console.log('Authorization header is missing');
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    console.log('Authorization header is not in Bearer format');
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  console.log(`Received token: ${token}`);

  const session = await SessionsCollection.findOne({ accessToken: token });
  console.log('Session:', session);

  if (!session) {
    console.log('Session not found');
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  console.log('Token expired:', isAccessTokenExpired);

  if (isAccessTokenExpired) {
    console.log('Access token is expired');
    return next(createHttpError(401, 'Access token is expired'));
  }

  const user = await UsersCollection.findById(session.userId);
  console.log('User:', user);

  if (!user) {
    console.log('User associated with this session is not found');
    return next(
      createHttpError(401, 'User associated with this session is not found!'),
    );
  }

  req.user = user;
  console.log('Authentication successful');
  return next();
};
