import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { type ISource, type RoleType } from 'src/store/jotai/signup';

interface ErrorResponse {
  message: string;
}

interface IErrorData {
  name: string;
  message: string;
  stack: string;
}

export function isApiError(error: unknown): error is IErrorRes {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as any).data?.message === 'string' &&
    typeof (error as any).data?.success === 'boolean'
  );
}

export function getApiError(error: unknown): IErrorRes | null {
  return isApiError(error) ? error : null;
}

/**
 * Extracts an error message from an RTK Query error response.
 *
 * @param error - The error object from an API call.
 * @returns The extracted error message or a default message.
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const fetchError = error as FetchBaseQueryError;

    if (
      typeof fetchError.data === 'object' &&
      fetchError.data !== null &&
      'message' in fetchError.data
    ) {
      return (fetchError.data as ErrorResponse).message;
    }
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    console.error(error);
    return (error as IErrorData).message;
  }

  console.error(error);
  return 'An unexpected error occurred.';
}

export interface ISuccessRes<T = any> {
  success: boolean;
  message: string;
  resultData: T;
}

export interface IErrorRes {
  status: number;
  data: {
    success: false;
    message: string;
    code?: string;
    resultData?: any;
  };
}

interface IUser {
  email: string;
  fullName: string;
  role: string;
}

export interface ISigninRes extends ISuccessRes {
  resultData: {
    user: IUser;
    token: string;
  };
}

export interface ISigninArgs {
  email: string;
  password: string;
}

export interface ISignupArgs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  dob: string;
  category?: string;
  source: ISource;
  type: RoleType;
  organizationName?: string;
}

export interface IVerifyOtpArgs {
  email: string;
  otp: string;
}

export interface IResendOtpArgs {
  email: string;
}

export interface IForgotPasswordArgs {
  email: string;
}

export interface IResetPasswordArgs {
  email: string;
  otp: string;
  password: string;
}

export interface IChangePasswordArgs {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ILevelArgs {
  targetXP: number;
}

export interface IActArgs {
  activityId?: string;
  title: string;
  xp: number;
  description: string;
  videoLink: string;
  isRecurring: boolean;
  startDate: string;
  endDate: string;
  assignedDays: string[];
  isSelfAssignment: boolean;
}

export interface IActivityApprove {
  activityIds: number[];
  remarks: string;
}

export interface ITempArgs {
  templateId?: number;
  title: string;
  description: string;
  videoLink: string;
  xp: number;
}

export interface IUpdateProfile {
  firstName: string;
  lastName?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'others';
  dob?: string;
  organizationName?: string;
}