import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '@eshop/grpc';
import { Field, ObjectType } from '@nestjs/graphql';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  password: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  bio?: string;

  @Field({ nullable: true })
  @Prop()
  avatarUrl?: string;

  @Field({ defaultValue: false })
  @Prop({ default: false })
  isVerified: boolean;

  @Field({ defaultValue: true })
  @Prop({ default: true })
  isActive: boolean;

  @Field({ defaultValue: Date.now })
  @Prop({ default: Date.now })
  lastLoginAt: Date;

  @Field()
  @Prop({
    enum: Object.keys(UserRole).filter(key =>
      key !== 'USER_ROLE_UNSPECIFIED' &&
      key !== 'UNRECOGNIZED' &&
      isNaN(Number(key))
    ).map(key => key.replace('USER_ROLE_', '')),
    default: 'USER'
  })
  role: string;

  @Field(() => [String], { defaultValue: [] })
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

  @Field()
  @Prop({default: now()})
  createdAt: Date;

  @Field()
  @Prop({default: now()})
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
