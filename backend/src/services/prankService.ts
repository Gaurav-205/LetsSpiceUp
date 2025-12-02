import Prank from '../models/Prank';
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
    friendPhone: data.friendPhone.trim(),
    friendEmail: data.friendEmail?.trim().toLowerCase(),
    relationship: data.relationship?.trim(),
    friendGender: data.friendGender,
    friendLocation: data.friendLocation?.trim(),
    personalityTypes: data.personalityTypes,
    prankType: data.prankType,
    additionalInfo: data.additionalInfo?.trim(),
    status: 'pending',
  });

  logger.info(`Prank created: ${prank._id} by user ${userId}`);

  const response: PrankResponse = {
    id: prank._id.toString(),
    yourName: prank.yourName,
    yourPhone: prank.yourPhone,
    yourEmail: prank.yourEmail,
    friendName: prank.friendName,
    friendAge: prank.friendAge,
    personalityTypes: prank.personalityTypes,
    prankType: prank.prankType,
    status: prank.status,
    createdAt: prank.createdAt,
    updatedAt: prank.updatedAt,
  };

    response.friendPhone = prank.friendPhone;
  if (prank.friendEmail) response.friendEmail = prank.friendEmail;
  if (prank.relationship) response.relationship = prank.relationship;
  if (prank.friendGender) response.friendGender = prank.friendGender;
  if (prank.friendLocation) response.friendLocation = prank.friendLocation;
  if (prank.additionalInfo) response.additionalInfo = prank.additionalInfo;

  return response;
};

export const getUserPranks = async (userId: string): Promise<PrankResponse[]> => {
  const pranks = await Prank.find({ userId })
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean();

  return pranks.map((prank) => {
    const response: PrankResponse = {
      id: prank._id.toString(),
      yourName: prank.yourName,
      yourPhone: prank.yourPhone,
      yourEmail: prank.yourEmail,
      friendName: prank.friendName,
      friendAge: prank.friendAge,
      personalityTypes: prank.personalityTypes,
      prankType: prank.prankType,
      status: prank.status,
      createdAt: prank.createdAt,
      updatedAt: prank.updatedAt,
    };

    response.friendPhone = prank.friendPhone;
    if (prank.friendEmail) response.friendEmail = prank.friendEmail;
    if (prank.relationship) response.relationship = prank.relationship;
    if (prank.friendGender) response.friendGender = prank.friendGender;
    if (prank.friendLocation) response.friendLocation = prank.friendLocation;
    if (prank.additionalInfo) response.additionalInfo = prank.additionalInfo;

    return response;
  });
};

export const getPrankById = async (
  userId: string,
  prankId: string
): Promise<PrankResponse | null> => {
  const prank = await Prank.findOne({ _id: prankId, userId }).lean();

  if (!prank) {
    return null;
  }

  const response: PrankResponse = {
    id: prank._id.toString(),
    yourName: prank.yourName,
    yourPhone: prank.yourPhone,
    yourEmail: prank.yourEmail,
    friendName: prank.friendName,
    friendAge: prank.friendAge,
    personalityTypes: prank.personalityTypes,
    prankType: prank.prankType,
    status: prank.status,
    createdAt: prank.createdAt,
    updatedAt: prank.updatedAt,
  };

    response.friendPhone = prank.friendPhone;
  if (prank.friendEmail) response.friendEmail = prank.friendEmail;
  if (prank.relationship) response.relationship = prank.relationship;
  if (prank.friendGender) response.friendGender = prank.friendGender;
  if (prank.friendLocation) response.friendLocation = prank.friendLocation;
  if (prank.additionalInfo) response.additionalInfo = prank.additionalInfo;

  return response;
};

