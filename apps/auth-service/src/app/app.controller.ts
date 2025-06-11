import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from '@eshop/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
