import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.model';
import * as bcrypt from 'bcrypt';
import {
  ChangePasswordDto,
  ChangePasswordResponseDto,
  CreateUserDto,
  CreateUserResponseDto,
  DeleteUserDto,
  DeleteUserResponseDto,
  GetUserByEmailDto,
  GetUserByEmailResponseDto,
  GetUserDto,
  GetUserResponseDto,
  GetUsersDto,
  GetUsersResponseDto,
  GetUserStatsDto,
  GetUserStatsResponseDto,
  RequestPasswordResetDto,
  RequestPasswordResetResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  UpdateUserDto,
  UpdateUserResponseDto,
  UpdateUserRoleDto,
  UpdateUserRoleResponseDto,
  UserRole,
  UsersServiceClient,
  VerifyEmailDto,
  VerifyEmailResponseDto,
} from '@eshop/grpc';
import { Observable, from } from 'rxjs';
import { GraphqlService } from '@eshop/graphql';
import { User as ProtoUser } from '@eshop/grpc';

@Injectable()
export class UsersService implements UsersServiceClient {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private graphqlService: GraphqlService
  ) {}

  createUser({
    email,
    password,
    firstName,
    lastName,
  }: CreateUserDto): Observable<CreateUserResponseDto> {
    const createUserPromise = async () => {
      try {
        // TODO: add salt and other security measures later
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });
        const savedUser = await newUser.save();
        return {
          success: true,
          message: 'User created successfully',
          user: this.mapToProtoUser(savedUser),
        };
      } catch (error) {
        this.logger.error('Error creating user:', error);
        return {
          success: false,
          message: 'Failed to create user',
          user: undefined
        };
      }
    }

    return from(createUserPromise());
  }

  getUsers(request: GetUsersDto): Observable<GetUsersResponseDto> {
    const getUsersPromise = async () => {
      const result = await this.graphqlService.paginate<UserDocument, ProtoUser>(
        this.userModel,
        {
          page: request.page,
          limit: request.limit,
          search: request.search,
          searchFields: ['email', 'firstName', 'lastName'],
          sortBy: 'createdAt',
          sortOrder: 'desc'
        },
        (user) => this.mapToProtoUser(user),
        'Users'
      );

      return {
        ...result,
        users: result.data,
      };
    }

    return from(getUsersPromise());
  }

  getUser(request: GetUserDto): Observable<GetUserResponseDto> {
    throw new Error('Method not implemented.');
  }

  getUserByEmail(
    request: GetUserByEmailDto,
    internal = false
  ): Observable<GetUserByEmailResponseDto> {
    const getUserByEmailPromise = async () => {
      try {
        const user = await this.userModel.findOne({ email: request.email }).exec();
        if (!user) {
          return {
            success: false,
            message: 'User not found',
            user: undefined,
          };
        }
        return {
          success: true,
          message: 'User retrieved successfully',
          user: this.mapToProtoUser(user, internal),
        };
      } catch (error) {
        this.logger.error('Error getting user by email:', error);
        return {
          success: false,
          message: 'Internal server error',
          user: undefined,
        };
      }
    }

    return from(getUserByEmailPromise());
  }

  getInternalUserByEmail(
    request: GetUserByEmailDto
  ): Observable<GetUserByEmailResponseDto> {
    return this.getUserByEmail(request, true);
  }

  updateUser(request: UpdateUserDto): Observable<UpdateUserResponseDto> {
    throw new Error('Method not implemented.');
  }

  deleteUser(request: DeleteUserDto): Observable<DeleteUserResponseDto> {
    throw new Error('Method not implemented.');
  }

  changePassword(
    request: ChangePasswordDto
  ): Observable<ChangePasswordResponseDto> {
    throw new Error('Method not implemented.');
  }

  verifyEmail(request: VerifyEmailDto): Observable<VerifyEmailResponseDto> {
    throw new Error('Method not implemented.');
  }

  requestPasswordReset(
    request: RequestPasswordResetDto
  ): Observable<RequestPasswordResetResponseDto> {
    throw new Error('Method not implemented.');
  }

  resetPassword(
    request: ResetPasswordDto
  ): Observable<ResetPasswordResponseDto> {
    throw new Error('Method not implemented.');
  }

  updateUserRole(
    request: UpdateUserRoleDto
  ): Observable<UpdateUserRoleResponseDto> {
    throw new Error('Method not implemented.');
  }

  getUserStats(request: GetUserStatsDto): Observable<GetUserStatsResponseDto> {
    throw new Error('Method not implemented.');
  }

  // async getUser(request: GetUserRequest): Promise<GetUserResponse> {
  //   try {
  //     const user = await this.userModel.findById(request.userId).exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //         user: undefined,
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: 'User retrieved successfully',
  //       user: this.mapToProtoUser(user),
  //     };
  //   } catch (error) {
  //     this.logger.error('Error getting user:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //       user: undefined,
  //     };
  //   }
  // }

  // async getUserByEmail(
  //   request: GetUserByEmailRequest
  // ): Promise<GetUserByEmailResponse> {
  //   try {
  //     const user = await this.userModel
  //       .findOne({ email: request.email })
  //       .exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //         user: undefined,
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: 'User retrieved successfully',
  //       user: this.mapToProtoUser(user),
  //     };
  //   } catch (error) {
  //     this.logger.error('Error getting user by email:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //       user: undefined,
  //     };
  //   }
  // }

  // async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
  //   try {
  //     const updateData: any = {};

  //     if (request.firstName) updateData.firstName = request.firstName;
  //     if (request.lastName) updateData.lastName = request.lastName;
  //     if (request.phone) updateData.phone = request.phone;
  //     if (request.bio) updateData.bio = request.bio;
  //     if (request.avatarUrl) updateData.avatarUrl = request.avatarUrl;
  //     if (request.preferences) updateData.preferences = request.preferences;

  //     const user = await this.userModel
  //       .findByIdAndUpdate(request.userId, updateData, { new: true })
  //       .exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //         user: undefined,
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: 'User updated successfully',
  //       user: this.mapToProtoUser(user),
  //     };
  //   } catch (error) {
  //     this.logger.error('Error updating user:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //       user: undefined,
  //     };
  //   }
  // }

  // async deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
  //   try {
  //     const user = await this.userModel
  //       .findByIdAndDelete(request.userId)
  //       .exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: 'User deleted successfully',
  //     };
  //   } catch (error) {
  //     this.logger.error('Error deleting user:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //     };
  //   }
  // }

  // async changePassword(
  //   request: ChangePasswordRequest
  // ): Promise<ChangePasswordResponse> {
  //   try {
  //     const user = await this.userModel.findById(request.userId).exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //       };
  //     }

  //     const isCurrentPasswordValid = await bcrypt.compare(
  //       request.currentPassword,
  //       user.password
  //     );

  //     if (!isCurrentPasswordValid) {
  //       return {
  //         success: false,
  //         message: 'Current password is incorrect',
  //       };
  //     }

  //     const hashedNewPassword = await bcrypt.hash(request.newPassword, 10);
  //     await this.userModel
  //       .findByIdAndUpdate(request.userId, { password: hashedNewPassword })
  //       .exec();

  //     return {
  //       success: true,
  //       message: 'Password changed successfully',
  //     };
  //   } catch (error) {
  //     this.logger.error('Error changing password:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //     };
  //   }
  // }

  // async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  //   try {
  //     const user = await this.userModel
  //       .findByIdAndUpdate(request.userId, { isVerified: true }, { new: true })
  //       .exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: 'Email verified successfully',
  //     };
  //   } catch (error) {
  //     this.logger.error('Error verifying email:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //     };
  //   }
  // }

  // async updateUserRole(
  //   request: UpdateUserRoleRequest
  // ): Promise<UpdateUserRoleResponse> {
  //   try {
  //     const user = await this.userModel
  //       .findByIdAndUpdate(
  //         request.userId,
  //         { role: request.role },
  //         { new: true }
  //       )
  //       .exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //         user: undefined,
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: 'User role updated successfully',
  //       user: this.mapToProtoUser(user),
  //     };
  //   } catch (error) {
  //     this.logger.error('Error updating user role:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //       user: undefined,
  //     };
  //   }
  // }

  // async validateUser(
  //   email: string,
  //   password: string
  // ): Promise<UserDocument | null> {
  //   const user = await this.userModel.findOne({ email }).exec();
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     return user;
  //   }
  //   return null;
  // }

  // async updateLastLogin(userId: string): Promise<void> {
  //   await this.userModel
  //     .findByIdAndUpdate(userId, { lastLoginAt: new Date() })
  //     .exec();
  // }

  // async requestPasswordReset(
  //   request: RequestPasswordResetRequest
  // ): Promise<RequestPasswordResetResponse> {
  //   try {
  //     const user = await this.userModel
  //       .findOne({ email: request.email })
  //       .exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //       };
  //     }

  //     // TODO: Generate reset token and send email
  //     // For now, just return success
  //     return {
  //       success: true,
  //       message: 'Password reset email sent successfully',
  //     };
  //   } catch (error) {
  //     this.logger.error('Error requesting password reset:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //     };
  //   }
  // }

  // async resetPassword(
  //   request: ResetPasswordRequest
  // ): Promise<ResetPasswordResponse> {
  //   try {
  //     const user = await this.userModel.findById(request.userId).exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //       };
  //     }

  //     // TODO: Validate reset token
  //     // For now, just update the password
  //     const hashedNewPassword = await bcrypt.hash(request.newPassword, 10);
  //     await this.userModel
  //       .findByIdAndUpdate(request.userId, { password: hashedNewPassword })
  //       .exec();

  //     return {
  //       success: true,
  //       message: 'Password reset successfully',
  //     };
  //   } catch (error) {
  //     this.logger.error('Error resetting password:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //     };
  //   }
  // }

  // async getUserStats(
  //   request: GetUserStatsRequest
  // ): Promise<GetUserStatsResponse> {
  //   try {
  //     const user = await this.userModel.findById(request.userId).exec();

  //     if (!user) {
  //       return {
  //         success: false,
  //         message: 'User not found',
  //         stats: undefined,
  //       };
  //     }

  //     // TODO: Implement actual stats calculation
  //     // For now, return basic stats
  //     const stats = {
  //       totalOrders: 0,
  //       totalSpent: 0,
  //       joinedDate: Math.floor(user.createdAt.getTime() / 1000),
  //       lastLoginDate: Math.floor(user.lastLoginAt.getTime() / 1000),
  //       accountStatus: user.isActive ? 'ACTIVE' : 'INACTIVE',
  //     };

  //     return {
  //       success: true,
  //       message: 'User stats retrieved successfully',
  //       stats,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error getting user stats:', error);
  //     return {
  //       success: false,
  //       message: 'Internal server error',
  //       stats: undefined,
  //     };
  //   }
  // }

  private mapToProtoUser(user: UserDocument, internal = false): ProtoUser {
    const userData: ProtoUser =  {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: Math.floor(user.createdAt.getTime() / 1000),
      updatedAt: Math.floor(user.updatedAt.getTime() / 1000),
      lastLoginAt: Math.floor(user.lastLoginAt.getTime() / 1000),
      isVerified: user.isVerified,
      isActive: user.isActive,
      role: this.mapToProtoRole(user.role),
      preferences: user.preferences,
    };
    if (internal) {
      userData.passwordHash = user.password;
    }
    return userData;
  }

  private mapToProtoRole(role: string): UserRole {
    switch (role) {
      case 'ADMIN':
        return UserRole.USER_ROLE_ADMIN;
      case 'SUPER_ADMIN':
        return UserRole.USER_ROLE_SUPER_ADMIN;
      default:
        return UserRole.USER_ROLE_USER;
    }
  }
}
