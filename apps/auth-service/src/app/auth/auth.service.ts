import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthServiceClient,
  LoginDto,
  LoginResponseDto,
  LogoutDto,
  LogoutResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  RegisterDto,
  RegisterResponseDto,
  VerifyTokenDto,
  VerifyTokenResponseDto,
} from '@eshop/grpc';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { compare } from 'bcrypt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { Response } from 'express';

@Injectable()
export class AuthService implements AuthServiceClient {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  login(request: LoginDto): Observable<LoginResponseDto> {
    this.logger.log(`Login attempt for email: ${request.email}`);

    return from(this.verifyUser(request.email, request.password)).pipe(
      map(user => {
        const expires = new Date();
        expires.setMilliseconds(
          expires.getTime() +
            parseInt(this.configService.getOrThrow('JWT_EXPIRATION_MS'))
        );

        const tokenPayload: TokenPayload = {
          sub: user.id,
          email: user.email,
          role: user.role,
        };

        const accessToken = this.jwtService.sign(tokenPayload);
        const refreshToken = ''; // TODO: Generate refresh token if needed later

        return {
          success: true,
          message: 'Login successful',
          accessToken,
          refreshToken,
          user,
          expiresAt: expires.getTime(),
        };
      }),
      catchError(error => {
        this.logger.error('Login error:', error);
        return throwError(() => new InternalServerErrorException(error));
      })
    );
  }

  authenticate(request: LoginDto, response: Response): Observable<LoginResponseDto> {
    return this.login(request).pipe(
      map(loginResponse => {
        if (loginResponse.success) {
          response.cookie('Authentication', loginResponse.accessToken, {
            httpOnly: true,
            secure: !!this.configService.get('SECURE_COOKIE'),
            expires: new Date(loginResponse.expiresAt),
          });
        }
        return loginResponse;
      })
    );
  }

  register(request: RegisterDto): Observable<RegisterResponseDto> {
    this.logger.log(`Registration attempt for email: ${request.email}`);

    return this.usersService.getUserByEmail({ email: request.email }).pipe(
      switchMap(existingUserResponse => {
        if (existingUserResponse.success && existingUserResponse.user) {
          this.logger.warn(`User with email ${request.email} already exists.`);
          return throwError(() => new ConflictException(`User with email ${request.email} already exists.`));
        }

        return this.usersService.createUser({
          email: request.email,
          password: request.password,
          firstName: request.firstName,
          lastName: request.lastName
        }).pipe(
          switchMap(newUserResponse => {
            if (!newUserResponse || !newUserResponse.success || !newUserResponse.user) {
              this.logger.error(`Failed to create user: ${request.email}`);
              return throwError(() => new InternalServerErrorException('Failed to create user.'));
            }

            this.logger.log(`User registered successfully: ${request.email}`);
            return from([{
              success: true,
              message: 'User registered successfully',
              user: newUserResponse.user,
            }]);
          })
        );
      }),
      catchError(error => {
        this.logger.error('Registration error:', error);
        return throwError(() => new InternalServerErrorException('Internal server error'));
      })
    );
  }

  refreshToken(request: RefreshTokenDto): Observable<RefreshTokenResponseDto> {
    throw new Error('Method not implemented.');
  }

  logout(request: LogoutDto): Observable<LogoutResponseDto> {
    throw new Error('Method not implemented.');
  }

  verifyToken(request: VerifyTokenDto): Observable<VerifyTokenResponseDto> {
    throw new Error('Method not implemented.');
  }

  private async verifyUser(email: string, password: string) {
    try {
      const userResponse = await firstValueFrom(
        this.usersService.getInternalUserByEmail({ email })
      );
      if (!userResponse?.success || !userResponse.user) {
        throw new UnauthorizedException('User not found.');
      }
      const authenticated = await compare(password, userResponse.user.passwordHash);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return userResponse.user;
    } catch (error) {
      this.logger.error(`Error verifying user: ${error.message}`, error.stack);
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  // async refreshToken(
  //   request: RefreshTokenRequest
  // ): Promise<RefreshTokenResponse> {
  //   try {
  //     // Verify refresh token
  //     if (!this.refreshTokens.has(request.refreshToken)) {
  //       return {
  //         success: false,
  //         message: 'Invalid refresh token',
  //         accessToken: '',
  //         refreshToken: '',
  //         expiresAt: 0,
  //       };
  //     }

  //     // Verify JWT
  //     const payload = this.jwtService.verify(request.refreshToken);

  //     // Generate new tokens
  //     const newPayload = {
  //       sub: payload.sub,
  //       email: payload.email,
  //       role: payload.role,
  //     };

  //     const accessToken = this.jwtService.sign(newPayload, {
  //       expiresIn: '15m',
  //     });
  //     const refreshToken = this.jwtService.sign(newPayload, {
  //       expiresIn: '7d',
  //     });

  //     // Remove old refresh token and add new one
  //     this.refreshTokens.delete(request.refreshToken);
  //     this.refreshTokens.add(refreshToken);

  //     const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;

  //     return {
  //       success: true,
  //       message: 'Token refreshed successfully',
  //       accessToken,
  //       refreshToken,
  //       expiresAt,
  //     };
  //   } catch (error) {
  //     this.logger.error('Refresh token error:', error);
  //     return {
  //       success: false,
  //       message: 'Invalid or expired refresh token',
  //       accessToken: '',
  //       refreshToken: '',
  //       expiresAt: 0,
  //     };
  //   }
  // }

  // async logout(request: LogoutRequest): Promise<LogoutResponse> {
  //   try {
  //     // Remove refresh token
  //     this.refreshTokens.delete(request.refreshToken);

  //     return {
  //       success: true,
  //       message: 'Logged out successfully',
  //     };
  //   } catch (error) {
  //     this.logger.error('Logout error:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //     };
  //   }
  // }

  // async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
  //   try {
  //     const payload = this.jwtService.verify(request.token);

  //     // Get user details
  //     const userResponse = await this.userService.getUserByEmail({
  //       email: payload.email,
  //     });

  //     if (!userResponse.success || !userResponse.user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //         userId: '',
  //         email: '',
  //         role: 0,
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: 'Token is valid',
  //       userId: payload.sub,
  //       email: payload.email,
  //       role: payload.role,
  //     };
  //   } catch (error) {
  //     this.logger.error('Token verification error:', error);
  //     return {
  //       success: false,
  //       message: 'Invalid or expired token',
  //       userId: '',
  //       email: '',
  //       role: 0,
  //     };
  //   }
  // }
}
