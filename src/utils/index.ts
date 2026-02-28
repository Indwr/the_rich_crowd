
import toast from 'react-hot-toast';

export const encodeBase64 = (input: string) => {
  return btoa(
    new TextEncoder().encode(input).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

export const decodeBase64 = (input: string) => {
  try {
    const binaryString = atob(input);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new TextDecoder().decode(bytes);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Invalid Base64 string');
  }
};

export const decodeParam = (param: string): string => {
  try {
    return decodeBase64(param);
  } catch (error) {
    toast.error('Error while decoding');
    console.error('Error while decoding', error);
    return '';
  }
};

// Function to check if a string is a valid Base64 encoded value
export const isBase64 = (param: string): boolean => {
  if (!param || param.trim() === '') return false;

  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const encodeQueryParams = (baseUrl: string, params: Record<string, any>): string => {
  const queryString = Object.entries(params)
    .filter(([key, value]) => {
      const stringValue = String(value ?? '').trim();
      return key.trim() !== '' && stringValue !== '';
    })
    .map(
      ([key, value]) =>
        `${encodeURIComponent(encodeBase64(key))}=${encodeURIComponent(encodeBase64(String(value ?? '')))}`
    )
    .join('&');

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const decodeQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const decodedParams: Record<string, string> = {};

  params.forEach((value, key) => {
    try {
      const decodedKey = decodeBase64(key);
      const decodedValue = decodeBase64(value);
      decodedParams[decodedKey] = decodedValue;
    } catch (error) {
      toast.error('Some query parameters could not be decoded.');
      console.error(`Error decoding: key=${key}, value=${value}`, error);
    }
  });

  return decodedParams;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterValues = (payload: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) =>
        (Array.isArray(value) && value.length > 0) ||
        (!Array.isArray(value) && value !== undefined && value !== null && value !== '')
    )
  );

export function formatDateToLongString(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid date';

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}