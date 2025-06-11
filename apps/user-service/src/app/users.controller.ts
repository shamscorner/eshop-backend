import { Controller, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangePasswordDto,
  DeleteUserDto,
  GetUserByEmailDto,
  GetUserDto,
  GetUsersDto,
  GetUserStatsDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  UsersServiceController,
  UsersServiceControllerMethods,
  VerifyEmailDto,
} from '@eshop/common';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  getUser(
    getUserDto: GetUserDto
  ) {
    return this.usersService.getUser(getUserDto);
  }

  getUserByEmail(
    getUserByEmailDto: GetUserByEmailDto
  ) {
    return this.usersService.getUserByEmail(getUserByEmailDto);
  }

  updateUser(
    updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(updateUserDto);
  }

  deleteUser(
    deleteUserDto: DeleteUserDto
  ) {
    return this.usersService.deleteUser(deleteUserDto);
  }

  changePassword(
    changePasswordDto: ChangePasswordDto
  ) {
    return this.usersService.changePassword(changePasswordDto);
  }

  verifyEmail(
    verifyEmailDto: VerifyEmailDto
  ) {
    return this.usersService.verifyEmail(verifyEmailDto);
  }

  requestPasswordReset(
    requestPasswordResetDto: RequestPasswordResetDto
  ) {
    return this.usersService.requestPasswordReset(requestPasswordResetDto);
  }

  resetPassword(
    resetPasswordDto: ResetPasswordDto
  ) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  getUsers(
    getUsersDto: GetUsersDto
  ) {
    return this.usersService.getUsers(getUsersDto);
  }

  updateUserRole(
    updateUserRoleDto: UpdateUserRoleDto
  ) {
    return this.usersService.updateUserRole(updateUserRoleDto);
  }

  getUserStats(
    getUserStatsDto: GetUserStatsDto
  ) {
    return this.usersService.getUserStats(getUserStatsDto);
  }
}
