import { JwtUserPayload } from '../models/auth/dto/jwt-user-payload.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUserPayload;
  }
}
