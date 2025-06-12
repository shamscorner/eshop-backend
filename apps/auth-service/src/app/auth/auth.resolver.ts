import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../users/models/user.model';
import { LoginInput } from './dto/login.input';
import { GqlContext } from '@eshop/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { map, switchMap } from 'rxjs/operators';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => User)
  login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: GqlContext
  ) {
    return this.authService.authenticate(loginInput, context.res);
  }

  @Mutation(() => User)
  register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context: GqlContext
  ) {
    return this.authService.register(registerInput).pipe(
      switchMap(registerResponse => {
        if (registerResponse.success) {
          return this.authService.authenticate({
            email: registerInput.email,
            password: registerInput.password,
          }, context.res).pipe(
            map(() => registerResponse)
          );
        }
        return [registerResponse];
      })
    );
  }
}
