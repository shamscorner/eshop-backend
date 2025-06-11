import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LogoutRequest,
} from '@auth-service/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequest) {
    try {
      this.logger.log(`Login attempt for email: ${loginRequest.email}`);
      const result = await this.authService.login(loginRequest);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.UNAUTHORIZED);
      }

      return {
        message: result.message,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        expiresAt: result.expiresAt,
      };
    } catch (error) {
      this.logger.error('Login error:', error);
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register')
  async register(@Body() registerRequest: RegisterRequest) {
    try {
      this.logger.log(
        `Registration attempt for email: ${registerRequest.email}`
      );
      const result = await this.authService.register(registerRequest);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        message: result.message,
        user: result.user,
      };
    } catch (error) {
      this.logger.error('Registration error:', error);
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('refresh')
  async refreshToken(@Body() refreshRequest: RefreshTokenRequest) {
    try {
      this.logger.log('Token refresh attempt');
      const result = await this.authService.refreshToken(refreshRequest);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.UNAUTHORIZED);
      }

      return {
        message: result.message,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: result.expiresAt,
      };
    } catch (error) {
      this.logger.error('Token refresh error:', error);
      throw new HttpException(
        'Token refresh failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Body() logoutRequest: LogoutRequest) {
    try {
      this.logger.log('Logout attempt');
      const result = await this.authService.logout(logoutRequest);

      return {
        message: result.message,
      };
    } catch (error) {
      this.logger.error('Logout error:', error);
      throw new HttpException(
        'Logout failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    try {
      this.logger.log(`Profile request for user: ${req.user.userId}`);
      return req.user;
    } catch (error) {
      this.logger.error('Profile error:', error);
      throw new HttpException(
        'Failed to get profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  async verifyToken(@Request() req) {
    try {
      return {
        message: 'Token is valid',
        user: req.user,
      };
    } catch (error) {
      this.logger.error('Token verification error:', error);
      throw new HttpException(
        'Token verification failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
