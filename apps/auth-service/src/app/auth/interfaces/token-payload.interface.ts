import { UserRole } from "@eshop/grpc";

export interface TokenPayload {
  sub: string,
  email: string,
  role: UserRole,
}
