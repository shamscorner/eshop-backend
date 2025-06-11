import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '@eshop/common';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phone?: string;

  @Prop()
  bio?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastLoginAt: Date;

  @Prop({
    enum: Object.keys(UserRole).filter(key =>
      key !== 'USER_ROLE_UNSPECIFIED' &&
      key !== 'UNRECOGNIZED' &&
      isNaN(Number(key))
    ).map(key => key.replace('USER_ROLE_', '')),
    default: 'USER'
  })
  role: string;

  @Prop({
    type: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' },
      theme: { type: String, default: 'light' },
    },
    default: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      language: 'en',
      timezone: 'UTC',
      theme: 'light',
    },
  })
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    language: string;
    timezone: string;
    theme: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
