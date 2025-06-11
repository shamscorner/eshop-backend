import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  GetUserRequest,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  GetUsersRequest,
  GetUsersResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
} from '@auth-service/common';

interface UserServiceClient {
  getUser(data: GetUserRequest): Promise<GetUserResponse>;
  updateUser(data: UpdateUserRequest): Promise<UpdateUserResponse>;
  deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse>;
  changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse>;
  getUsers(data: GetUsersRequest): Promise<GetUsersResponse>;
  updateUserRole(data: UpdateUserRoleRequest): Promise<UpdateUserRoleResponse>;
}

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
  private userService: UserServiceClient;

  constructor(@Inject('USER_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    try {
      return await this.userService.getUser(request);
    } catch (error) {
      this.logger.error('User service get user error:', error);
      throw error;
    }
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      return await this.userService.updateUser(request);
    } catch (error) {
      this.logger.error('User service update user error:', error);
      throw error;
    }
  }

  async deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    try {
      return await this.userService.deleteUser(request);
    } catch (error) {
      this.logger.error('User service delete user error:', error);
      throw error;
    }
  }

  async changePassword(
    request: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    try {
      return await this.userService.changePassword(request);
    } catch (error) {
      this.logger.error('User service change password error:', error);
      throw error;
    }
  }

  async getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    try {
      return await this.userService.getUsers(request);
    } catch (error) {
      this.logger.error('User service get users error:', error);
      throw error;
    }
  }

  async updateUserRole(
    request: UpdateUserRoleRequest
  ): Promise<UpdateUserRoleResponse> {
    try {
      return await this.userService.updateUserRole(request);
    } catch (error) {
      this.logger.error('User service update user role error:', error);
      throw error;
    }
  }
}
