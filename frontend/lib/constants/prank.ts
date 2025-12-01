// Shared constants for prank-related features

export const PRANK_TYPES = [
  { value: 'scare', emoji: '👻', label: 'Scare Them', description: 'Give them a good fright' },
  { value: 'embarrass', emoji: '😳', label: 'Embarrass Them', description: 'Make them blush' },
  { value: 'laugh', emoji: '😂', label: 'Make Them Laugh', description: 'Hilarious pranks' },
  { value: 'confuse', emoji: '🤔', label: 'Confuse Them', description: 'Mind-bending tricks' },
  { value: 'shock', emoji: '⚡', label: 'Shock Them', description: 'Unexpected surprises' },
] as const;

export const PRANK_TYPE_LABELS: Record<string, { emoji: string; label: string; description: string }> = {
  scare: { emoji: '👻', label: 'Scare Them', description: 'Give them a good fright' },
  embarrass: { emoji: '😳', label: 'Embarrass Them', description: 'Make them blush' },
  laugh: { emoji: '😂', label: 'Make Them Laugh', description: 'Hilarious pranks' },
  confuse: { emoji: '🤔', label: 'Confuse Them', description: 'Mind-bending tricks' },
  shock: { emoji: '⚡', label: 'Shock Them', description: 'Unexpected surprises' },
};

export const PRANK_TYPE_LABELS_SIMPLE: Record<string, string> = {
  scare: '👻 Scare Them',
  embarrass: '😳 Embarrass Them',
  laugh: '😂 Make Them Laugh',
  confuse: '🤔 Confuse Them',
  shock: '⚡ Shock Them',
};

export const PERSONALITY_TYPES = [
  'Party Animal',
  'Tech Nerd',
  'Foodie',
  'Gym Enthusiast',
  'Bookworm',
  'Gamer',
  'Social Butterfly',
  'Introvert',
  'Adventurer',
  'Homebody',
] as const;

export const STATUS_LABELS: Record<string, { label: string; color: string; borderColor: string }> = {
  pending: { label: 'Pending', color: 'text-[#EAB308]', borderColor: 'rgba(234, 179, 8, 0.3)' },
  processing: { label: 'Processing', color: 'text-[#5285E8]', borderColor: 'rgba(82, 133, 232, 0.3)' },
  completed: { label: 'Completed', color: 'text-[#BFFF00]', borderColor: 'rgba(191, 255, 0, 0.3)' },
  cancelled: { label: 'Cancelled', color: 'text-[#FFFFFF]', borderColor: 'rgba(255, 255, 255, 0.2)' },
};

