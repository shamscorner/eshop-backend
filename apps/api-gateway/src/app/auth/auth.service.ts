import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
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

interface AuthServiceClient {
  login(data: LoginRequest): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<RegisterResponse>;
  refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse>;
  logout(data: LogoutRequest): Promise<LogoutResponse>;
  verifyToken(data: VerifyTokenRequest): Promise<VerifyTokenResponse>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private authService: AuthServiceClient;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      return await this.authService.login(request);
    } catch (error) {
      this.logger.error('Auth service login error:', error);
      throw error;
    }
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      return await this.authService.register(request);
    } catch (error) {
      this.logger.error('Auth service register error:', error);
      throw error;
    }
  }

  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      return await this.authService.refreshToken(request);
    } catch (error) {
      this.logger.error('Auth service refresh token error:', error);
      throw error;
    }
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    try {
      return await this.authService.logout(request);
    } catch (error) {
      this.logger.error('Auth service logout error:', error);
      throw error;
    }
  }

  async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    try {
      return await this.authService.verifyToken(request);
    } catch (error) {
      this.logger.error('Auth service verify token error:', error);
      throw error;
    }
  }
}
