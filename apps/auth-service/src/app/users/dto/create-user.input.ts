import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsStrongPassword()
  password: string;
}
