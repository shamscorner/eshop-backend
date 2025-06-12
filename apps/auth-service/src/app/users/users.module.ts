import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { GraphqlService } from '@eshop/mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UsersResolver, UsersService, GraphqlService],
  exports: [UsersService],
})
export class UsersModule {}
