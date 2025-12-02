export interface PrankSubmissionData {
  yourName: string;
  yourPhone: string;
  yourEmail: string;
  friendName: string;
  friendAge: string;
  friendPhone: string; // Required
  friendEmail?: string;
  relationship?: string;
  friendGender?: string;
  friendLocation?: string;
  personalityTypes: string[];
  prankType: string;
  additionalInfo?: string;
}

export interface PrankResponse {
  id: string;
  yourName: string;
  yourPhone: string;
  yourEmail: string;
  friendName: string;
  friendAge: string;
  friendPhone: string; // Required
  friendEmail?: string;
  relationship?: string;
  friendGender?: string;
  friendLocation?: string;
  personalityTypes: string[];
  prankType: string;
  additionalInfo?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

