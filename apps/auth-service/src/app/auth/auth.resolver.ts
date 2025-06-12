import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../users/models/user.model';
import { LoginInput } from './dto/login.input';
import { GqlContext } from '@eshop/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { firstValueFrom } from 'rxjs';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => User)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: GqlContext
  ) {
    return this.authService.authenticate(loginInput, context.res);
  }

  @Mutation(() => User)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context: GqlContext
  ) {
    const registerResponse = await firstValueFrom(this.authService.register(registerInput));
    if (registerResponse.success) {
      await this.authService.authenticate({
        email: registerInput.email,
        password: registerInput.password,
      }, context.res);
    }
    return registerResponse;
  }
}
