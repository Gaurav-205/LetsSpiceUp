// Default form data structure for prank wizard

export interface FormData {
  yourName: string;
  yourPhone: string;
  yourEmail: string;
  friendName: string;
  friendAge: string;
  personalityTypes: string[];
  prankType: string;
  additionalInfo: string;
}

export const DEFAULT_FORM_DATA: FormData = {
  yourName: '',
  yourPhone: '',
  yourEmail: '',
  friendName: '',
  friendAge: '',
  personalityTypes: [],
  prankType: '',
  additionalInfo: '',
};

export function loadFormDataFromStorage(): FormData {
  if (typeof window === 'undefined') {
    return DEFAULT_FORM_DATA;
  }
  
  const saved = localStorage.getItem('prank-wizard-form');
  if (!saved) {
    return DEFAULT_FORM_DATA;
  }
  
  try {
    const parsed = JSON.parse(saved);
    // Validate and merge with defaults to ensure all fields exist
    return { ...DEFAULT_FORM_DATA, ...parsed };
  } catch {
    return DEFAULT_FORM_DATA;
  }
}

