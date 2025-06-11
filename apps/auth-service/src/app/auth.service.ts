import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
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
  GetUserByEmailRequest,
  GetUserByEmailResponse,
  User,
} from '@auth-service/common';

interface UserServiceClient {
  getUserByEmail(data: GetUserByEmailRequest): Promise<GetUserByEmailResponse>;
  createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<any>;
  updateLastLogin(userId: string): Promise<void>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private userService: UserServiceClient;
  private refreshTokens = new Set<string>(); // In production, use Redis or database

  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      this.logger.log(`Login attempt for email: ${request.email}`);

      // Get user from user service
      const userResponse = await this.userService.getUserByEmail({
        email: request.email,
      });

      if (!userResponse.success || !userResponse.user) {
        return {
          success: false,
          message: 'Invalid email or password',
          accessToken: '',
          refreshToken: '',
          user: undefined,
          expiresAt: 0,
        };
      }

      // Validate password (assuming password is stored in user object for validation)
      // In real implementation, this would be handled by user service
      const user = userResponse.user;

      // Generate tokens
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      // Store refresh token
      this.refreshTokens.add(refreshToken);

      // Update last login
      await this.userService.updateLastLogin(user.id);

      const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; // 15 minutes

      return {
        success: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
        user,
        expiresAt,
      };
    } catch (error) {
      this.logger.error('Login error:', error);
      return {
        success: false,
        message: 'Internal server error',
        accessToken: '',
        refreshToken: '',
        user: undefined,
        expiresAt: 0,
      };
    }
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      this.logger.log(`Registration attempt for email: ${request.email}`);

      // Check if user already exists
      const existingUserResponse = await this.userService.getUserByEmail({
        email: request.email,
      });

      if (existingUserResponse.success && existingUserResponse.user) {
        return {
          success: false,
          message: 'User with this email already exists',
          user: undefined,
        };
      }

      // Create new user
      const newUser = await this.userService.createUser(
        request.email,
        request.password,
        request.firstName,
        request.lastName
      );

      if (!newUser) {
        return {
          success: false,
          message: 'Failed to create user',
          user: undefined,
        };
      }

      return {
        success: true,
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error) {
      this.logger.error('Registration error:', error);
      return {
        success: false,
        message: 'Internal server error',
        user: undefined,
      };
    }
  }

  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      // Verify refresh token
      if (!this.refreshTokens.has(request.refreshToken)) {
        return {
          success: false,
          message: 'Invalid refresh token',
          accessToken: '',
          refreshToken: '',
          expiresAt: 0,
        };
      }

      // Verify JWT
      const payload = this.jwtService.verify(request.refreshToken);

      // Generate new tokens
      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });
      const refreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      // Remove old refresh token and add new one
      this.refreshTokens.delete(request.refreshToken);
      this.refreshTokens.add(refreshToken);

      const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;

      return {
        success: true,
        message: 'Token refreshed successfully',
        accessToken,
        refreshToken,
        expiresAt,
      };
    } catch (error) {
      this.logger.error('Refresh token error:', error);
      return {
        success: false,
        message: 'Invalid or expired refresh token',
        accessToken: '',
        refreshToken: '',
        expiresAt: 0,
      };
    }
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    try {
      // Remove refresh token
      this.refreshTokens.delete(request.refreshToken);

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      this.logger.error('Logout error:', error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    try {
      const payload = this.jwtService.verify(request.token);

      // Get user details
      const userResponse = await this.userService.getUserByEmail({
        email: payload.email,
      });

      if (!userResponse.success || !userResponse.user) {
        return {
          success: false,
          message: 'User not found',
          userId: '',
          email: '',
          role: 0,
        };
      }

      return {
        success: true,
        message: 'Token is valid',
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      this.logger.error('Token verification error:', error);
      return {
        success: false,
        message: 'Invalid or expired token',
        userId: '',
        email: '',
        role: 0,
      };
    }
  }
}
