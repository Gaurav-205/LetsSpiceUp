import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  isEmailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
// Note: email already has an index from unique: true, so we don't add it again
// Note: googleId with sparse: true doesn't automatically create an index, but we'll let Mongoose handle it
// Only add indexes for fields that don't have automatic indexing
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ resetPasswordExpires: 1 });

export default mongoose.model<IUser>('User', UserSchema);

