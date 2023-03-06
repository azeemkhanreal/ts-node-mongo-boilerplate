
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from 'config';
import { TokenTypes } from '../utils/constants'
import User from '../api/resources/user/user.model';
import { JwtPayload } from 'jsonwebtoken';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get<string>('jwt.secret')
};

const jwtVerify = async (jwtPayload: JwtPayload, done: any) => {
  try {
    if (jwtPayload.type !== TokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(jwtPayload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
