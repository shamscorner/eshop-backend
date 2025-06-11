import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClientGrpc } from '@nestjs/microservices';
import { VerifyTokenRequest, VerifyTokenResponse } from '@auth-service/common';

interface AuthServiceClient {
  verifyToken(data: VerifyTokenRequest): Promise<VerifyTokenResponse>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private authService: AuthServiceClient;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
    });
  }

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  async validate(payload: any) {
    // Additional validation with auth service
    const result = await this.authService.verifyToken({
      token: payload.token,
    });

    if (!result.success) {
      return null;
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
