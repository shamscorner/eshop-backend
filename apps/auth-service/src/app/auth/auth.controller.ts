import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  GrpcLoggingInterceptor,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  RegisterDto,
  VerifyTokenDto,
} from '@eshop/grpc';

@Controller()
@AuthServiceControllerMethods()
@UseInterceptors(GrpcLoggingInterceptor)
export class AuthController implements AuthServiceController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  login(loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  register(request: RegisterDto) {
    return this.authService.register(request);
  }

  refreshToken(request: RefreshTokenDto) {
    return this.authService.refreshToken(request);
  }

  logout(request: LogoutDto) {
    return this.authService.logout(request);
  }

  verifyToken(request: VerifyTokenDto) {
    return this.authService.verifyToken(request);
  }
}
