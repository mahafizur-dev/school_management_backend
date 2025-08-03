import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

// Define the shape of the payload we expect in the JWT
export interface JwtPayload {
  email: string;
  sub: string; // This will be the user's ID
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // This method is called by Passport after it successfully validates the token's signature and expiration.
  // The payload is the decoded JSON from the token.
  async validate(payload: JwtPayload) {
    // We can use the user ID from the payload to fetch the full user object.
    // This ensures the user still exists in our database.
    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    // Passport will attach this return value to the `request.user` object.
    return user;
  }
}
