import Prank, { IPrank } from '../models/Prank';
import { PrankSubmissionData, PrankResponse } from '../types/prank';
import { logger } from '../utils/logger';

export const createPrank = async (
  userId: string,
  data: PrankSubmissionData
): Promise<PrankResponse> => {
  const prank = await Prank.create({
    userId,
    yourName: data.yourName.trim(),
    yourPhone: data.yourPhone.trim(),
    yourEmail: data.yourEmail.trim().toLowerCase(),
    friendName: data.friendName.trim(),
    friendAge: data.friendAge,
    personalityTypes: data.personalityTypes,
    prankType: data.prankType,
    additionalInfo: data.additionalInfo?.trim(),
    status: 'pending',
  });

  logger.info(`Prank created: ${prank._id} by user ${userId}`);

  return {
    id: prank._id.toString(),
    yourName: prank.yourName,
    yourPhone: prank.yourPhone,
    yourEmail: prank.yourEmail,
    friendName: prank.friendName,
    friendAge: prank.friendAge,
    personalityTypes: prank.personalityTypes,
    prankType: prank.prankType,
    additionalInfo: prank.additionalInfo,
    status: prank.status,
    createdAt: prank.createdAt,
    updatedAt: prank.updatedAt,
  };
};

export const getUserPranks = async (userId: string): Promise<PrankResponse[]> => {
  const pranks = await Prank.find({ userId })
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean();

  return pranks.map((prank) => ({
    id: prank._id.toString(),
    yourName: prank.yourName,
    yourPhone: prank.yourPhone,
    yourEmail: prank.yourEmail,
    friendName: prank.friendName,
    friendAge: prank.friendAge,
    personalityTypes: prank.personalityTypes,
    prankType: prank.prankType,
    additionalInfo: prank.additionalInfo,
    status: prank.status,
    createdAt: prank.createdAt,
    updatedAt: prank.updatedAt,
  }));
};

export const getPrankById = async (
  userId: string,
  prankId: string
): Promise<PrankResponse | null> => {
  const prank = await Prank.findOne({ _id: prankId, userId }).lean();

  if (!prank) {
    return null;
  }

  return {
    id: prank._id.toString(),
    yourName: prank.yourName,
    yourPhone: prank.yourPhone,
    yourEmail: prank.yourEmail,
    friendName: prank.friendName,
    friendAge: prank.friendAge,
    personalityTypes: prank.personalityTypes,
    prankType: prank.prankType,
    additionalInfo: prank.additionalInfo,
    status: prank.status,
    createdAt: prank.createdAt,
    updatedAt: prank.updatedAt,
  };
};

