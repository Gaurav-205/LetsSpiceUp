export interface PrankSubmissionData {
  yourName: string;
  yourPhone: string;
  yourEmail: string;
  friendName: string;
  friendAge: string;
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
  personalityTypes: string[];
  prankType: string;
  additionalInfo?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

