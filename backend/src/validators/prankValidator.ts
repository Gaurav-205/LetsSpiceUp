import { PrankSubmissionData } from '../types/prank';

export const validatePrankSubmission = (data: Partial<PrankSubmissionData>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.yourName || data.yourName.trim().length < 2) {
    errors.push('Your name must be at least 2 characters long');
  }

  if (!data.yourPhone || data.yourPhone.trim().length < 5) {
    errors.push('Phone number is required');
  }

  if (!data.yourEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.yourEmail)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.friendName || data.friendName.trim().length < 2) {
    errors.push("Friend's name must be at least 2 characters long");
  }

  if (!data.friendAge) {
    errors.push('Age range is required');
  }

  if (!data.friendPhone || data.friendPhone.trim().length < 5) {
    errors.push('Target phone number is required');
  }

  // Validate optional email if provided
  if (data.friendEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.friendEmail)) {
    errors.push('Please provide a valid target email address');
  }

  if (!data.personalityTypes || data.personalityTypes.length === 0) {
    errors.push('Select at least one personality type');
  }

  if (!data.prankType) {
    errors.push('Prank type is required');
  } else if (!['scare', 'embarrass', 'laugh', 'confuse', 'shock'].includes(data.prankType)) {
    errors.push('Invalid prank type');
  }

  // Validate additional info length if provided
  if (data.additionalInfo && data.additionalInfo.length > 2000) {
    errors.push('Additional info must be less than 2000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

