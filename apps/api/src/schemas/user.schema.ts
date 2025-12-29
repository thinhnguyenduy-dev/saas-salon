import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  RECEPTIONIST = 'RECEPTIONIST',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ select: false }) // Hide password by default
  password: string;

  @Prop()
  phone?: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.STAFF,
    index: true,
  })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'Shop', index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  // Methods
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(PaginatePlugin);

// Pre-save hook for password hashing
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
