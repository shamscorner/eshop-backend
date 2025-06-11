import { Injectable } from '@nestjs/common';
import { LoginDto } from '@eshop/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  login({ email, password }: LoginDto) {
    const payload = {
      sub: '123', // This would be the user ID from the database
      username: email, // This could be the username or email
      role: 'user',
    };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
