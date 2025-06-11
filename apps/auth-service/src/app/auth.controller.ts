import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from '@auth-service/common';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(request: LoginRequest): Promise<LoginResponse> {
    this.logger.log(`Login request for email: ${request.email}`);
    return this.authService.login(request);
  }

  @GrpcMethod('AuthService', 'Register')
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    this.logger.log(`Register request for email: ${request.email}`);
    return this.authService.register(request);
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    this.logger.log('Refresh token request');
    return this.authService.refreshToken(request);
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    this.logger.log('Logout request');
    return this.authService.logout(request);
  }

  @GrpcMethod('AuthService', 'VerifyToken')
  async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    this.logger.log('Verify token request');
    return this.authService.verifyToken(request);
  }
}
