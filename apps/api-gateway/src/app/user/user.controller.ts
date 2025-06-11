import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import {
  UpdateUserRequest,
  ChangePasswordRequest,
  GetUsersRequest,
  UpdateUserRoleRequest,
} from '@auth-service/common';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    try {
      const result = await this.userService.getUser({
        userId: req.user.userId,
      });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.NOT_FOUND);
      }

      return {
        message: result.message,
        user: result.user,
      };
    } catch (error) {
      this.logger.error('Get profile error:', error);
      throw new HttpException(
        'Failed to get profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Request() req,
    @Body() updateData: Partial<UpdateUserRequest>
  ) {
    try {
      const result = await this.userService.updateUser({
        userId: req.user.userId,
        ...updateData,
      });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        message: result.message,
        user: result.user,
      };
    } catch (error) {
      this.logger.error('Update profile error:', error);
      throw new HttpException(
        'Failed to update profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Request() req,
    @Body() changePasswordData: Omit<ChangePasswordRequest, 'userId'>
  ) {
    try {
      const result = await this.userService.changePassword({
        userId: req.user.userId,
        ...changePasswordData,
      });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        message: result.message,
      };
    } catch (error) {
      this.logger.error('Change password error:', error);
      throw new HttpException(
        'Failed to change password',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('profile')
  @UseGuards(AuthGuard('jwt'))
  async deleteAccount(@Request() req) {
    try {
      const result = await this.userService.deleteUser({
        userId: req.user.userId,
      });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        message: result.message,
      };
    } catch (error) {
      this.logger.error('Delete account error:', error);
      throw new HttpException(
        'Failed to delete account',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id') id: string) {
    try {
      const result = await this.userService.getUser({ userId: id });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.NOT_FOUND);
      }

      return {
        message: result.message,
        user: result.user,
      };
    } catch (error) {
      this.logger.error('Get user error:', error);
      throw new HttpException(
        'Failed to get user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string
  ) {
    try {
      const request: GetUsersRequest = {
        page: page || 1,
        limit: limit || 10,
        search: search || '',
        sortBy: sortBy || '',
        sortOrder: sortOrder === 'desc' ? 2 : 1, // SORT_ORDER_DESC : SORT_ORDER_ASC
      };

      const result = await this.userService.getUsers(request);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        message: result.message,
        users: result.users,
        pagination: result.pagination,
      };
    } catch (error) {
      this.logger.error('Get users error:', error);
      throw new HttpException(
        'Failed to get users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id/role')
  @UseGuards(AuthGuard('jwt'))
  async updateUserRole(
    @Param('id') id: string,
    @Body() roleData: Omit<UpdateUserRoleRequest, 'userId'>
  ) {
    try {
      // In a real app, you'd check if the current user has admin privileges
      const result = await this.userService.updateUserRole({
        userId: id,
        ...roleData,
      });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        message: result.message,
        user: result.user,
      };
    } catch (error) {
      this.logger.error('Update user role error:', error);
      throw new HttpException(
        'Failed to update user role',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
