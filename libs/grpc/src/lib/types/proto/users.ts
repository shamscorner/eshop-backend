// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.4
//   protoc               v3.20.3
// source: libs/grpc/src/lib/proto/users.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { PaginationInfo, SortOrder, User, UserPreferences, UserRole } from "./common";

/** Sort options for user listing (specific to user service) */
export enum UserSortBy {
  USER_SORT_BY_UNSPECIFIED = 0,
  USER_SORT_BY_CREATED_AT = 1,
  USER_SORT_BY_UPDATED_AT = 2,
  USER_SORT_BY_EMAIL = 3,
  USER_SORT_BY_FIRST_NAME = 4,
  USER_SORT_BY_LAST_NAME = 5,
  USER_SORT_BY_LAST_LOGIN = 6,
  UNRECOGNIZED = -1,
}

export interface GetUserDto {
  userId: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName?: string | undefined;
  phone?: string | undefined;
  bio?: string | undefined;
  avatarUrl?: string | undefined;
  role?: UserRole | undefined;
  preferences?: UserPreferences | undefined;
}

export interface CreateUserResponseDto {
  success: boolean;
  message: string;
  user?: User | undefined;
}

export interface GetUserResponseDto {
  success: boolean;
  message: string;
  user?: User | undefined;
}

export interface GetUserByEmailDto {
  email: string;
}

export interface GetUserByEmailResponseDto {
  success: boolean;
  message: string;
  user?: User | undefined;
}

export interface UpdateUserDto {
  userId: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  phone?: string | undefined;
  bio?: string | undefined;
  avatarUrl?: string | undefined;
  preferences?: UserPreferences | undefined;
}

export interface UpdateUserResponseDto {
  success: boolean;
  message: string;
  user: User | undefined;
}

export interface DeleteUserDto {
  userId: string;
  /** Confirm with password */
  password: string;
}

export interface DeleteUserResponseDto {
  success: boolean;
  message: string;
}

export interface ChangePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponseDto {
  success: boolean;
  message: string;
}

export interface VerifyEmailDto {
  userId: string;
  verificationToken: string;
}

export interface VerifyEmailResponseDto {
  success: boolean;
  message: string;
}

export interface RequestPasswordResetDto {
  email: string;
}

export interface RequestPasswordResetResponseDto {
  success: boolean;
  message: string;
}

export interface ResetPasswordDto {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponseDto {
  success: boolean;
  message: string;
}

export interface GetUsersDto {
  page: number;
  limit: number;
  /** Search by email, name */
  search?: string | undefined;
  roleFilter?: UserRole | undefined;
  verifiedFilter?: boolean | undefined;
  sortBy?: UserSortBy | undefined;
  sortOrder?: SortOrder | undefined;
}

export interface GetUsersResponseDto {
  success: boolean;
  message: string;
  users: User[];
  pagination: PaginationInfo | undefined;
}

export interface UpdateUserRoleDto {
  userId: string;
  newRole: UserRole;
  /** Admin performing the action */
  adminUserId: string;
}

export interface UpdateUserRoleResponseDto {
  success: boolean;
  message: string;
  user: User | undefined;
}

export interface GetUserStatsDto {
  /** Unix timestamp */
  startDate?:
    | number
    | undefined;
  /** Unix timestamp */
  endDate?: number | undefined;
}

export interface GetUserStatsResponseDto {
  success: boolean;
  message: string;
  stats: UserStatistics | undefined;
}

/** User statistics (specific to user service) */
export interface UserStatistics {
  totalUsers: number;
  verifiedUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  usersByRole: { [key: string]: number };
  dailySignups: DailyUserCount[];
}

export interface UserStatistics_UsersByRoleEntry {
  key: string;
  value: number;
}

/** Daily user count for statistics */
export interface DailyUserCount {
  /** YYYY-MM-DD format */
  date: string;
  count: number;
}

export const USERS_PACKAGE_NAME = "users";

export interface UsersServiceClient {
  createUser(request: CreateUserDto): Observable<CreateUserResponseDto>;

  getUser(request: GetUserDto): Observable<GetUserResponseDto>;

  getUserByEmail(request: GetUserByEmailDto): Observable<GetUserByEmailResponseDto>;

  updateUser(request: UpdateUserDto): Observable<UpdateUserResponseDto>;

  deleteUser(request: DeleteUserDto): Observable<DeleteUserResponseDto>;

  changePassword(request: ChangePasswordDto): Observable<ChangePasswordResponseDto>;

  verifyEmail(request: VerifyEmailDto): Observable<VerifyEmailResponseDto>;

  requestPasswordReset(request: RequestPasswordResetDto): Observable<RequestPasswordResetResponseDto>;

  resetPassword(request: ResetPasswordDto): Observable<ResetPasswordResponseDto>;

  getUsers(request: GetUsersDto): Observable<GetUsersResponseDto>;

  updateUserRole(request: UpdateUserRoleDto): Observable<UpdateUserRoleResponseDto>;

  getUserStats(request: GetUserStatsDto): Observable<GetUserStatsResponseDto>;
}

export interface UsersServiceController {
  createUser(
    request: CreateUserDto,
  ): Promise<CreateUserResponseDto> | Observable<CreateUserResponseDto> | CreateUserResponseDto;

  getUser(request: GetUserDto): Promise<GetUserResponseDto> | Observable<GetUserResponseDto> | GetUserResponseDto;

  getUserByEmail(
    request: GetUserByEmailDto,
  ): Promise<GetUserByEmailResponseDto> | Observable<GetUserByEmailResponseDto> | GetUserByEmailResponseDto;

  updateUser(
    request: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> | Observable<UpdateUserResponseDto> | UpdateUserResponseDto;

  deleteUser(
    request: DeleteUserDto,
  ): Promise<DeleteUserResponseDto> | Observable<DeleteUserResponseDto> | DeleteUserResponseDto;

  changePassword(
    request: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> | Observable<ChangePasswordResponseDto> | ChangePasswordResponseDto;

  verifyEmail(
    request: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> | Observable<VerifyEmailResponseDto> | VerifyEmailResponseDto;

  requestPasswordReset(
    request: RequestPasswordResetDto,
  ):
    | Promise<RequestPasswordResetResponseDto>
    | Observable<RequestPasswordResetResponseDto>
    | RequestPasswordResetResponseDto;

  resetPassword(
    request: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> | Observable<ResetPasswordResponseDto> | ResetPasswordResponseDto;

  getUsers(request: GetUsersDto): Promise<GetUsersResponseDto> | Observable<GetUsersResponseDto> | GetUsersResponseDto;

  updateUserRole(
    request: UpdateUserRoleDto,
  ): Promise<UpdateUserRoleResponseDto> | Observable<UpdateUserRoleResponseDto> | UpdateUserRoleResponseDto;

  getUserStats(
    request: GetUserStatsDto,
  ): Promise<GetUserStatsResponseDto> | Observable<GetUserStatsResponseDto> | GetUserStatsResponseDto;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUser",
      "getUser",
      "getUserByEmail",
      "updateUser",
      "deleteUser",
      "changePassword",
      "verifyEmail",
      "requestPasswordReset",
      "resetPassword",
      "getUsers",
      "updateUserRole",
      "getUserStats",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USERS_SERVICE_NAME = "UsersService";
