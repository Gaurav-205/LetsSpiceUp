import mongoose, { Document, Schema } from 'mongoose';

export interface IPrank extends Document {
  userId: mongoose.Types.ObjectId;
  // Planner info
  yourName: string;
  yourPhone: string;
  yourEmail: string;
  // Target/Friend info
  friendName: string;
  friendAge: string;
  friendPhone?: string;
  friendEmail?: string;
  relationship?: string;
  friendGender?: string;
  friendLocation?: string;
  personalityTypes: string[];
  // Prank details
  prankType: string;
  additionalInfo?: string;
  // Status
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const PrankSchema = new Schema<IPrank>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    yourName: {
      type: String,
      required: true,
      trim: true,
    },
    yourPhone: {
      type: String,
      required: true,
      trim: true,
    },
    yourEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    friendName: {
      type: String,
      required: true,
      trim: true,
    },
    friendAge: {
      type: String,
      required: true,
    },
    friendPhone: {
      type: String,
      required: true,
      trim: true,
    },
    friendEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    relationship: {
      type: String,
      trim: true,
    },
    friendGender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    },
    friendLocation: {
      type: String,
      trim: true,
    },
    personalityTypes: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one personality type is required',
      },
    },
    prankType: {
      type: String,
      required: true,
      enum: ['scare', 'embarrass', 'laugh', 'confuse', 'shock'],
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
PrankSchema.index({ userId: 1, createdAt: -1 });
PrankSchema.index({ status: 1 });

export default mongoose.model<IPrank>('Prank', PrankSchema);

