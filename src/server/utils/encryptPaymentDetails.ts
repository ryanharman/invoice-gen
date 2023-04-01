import { decryptValue, encryptValue } from "./encryption";

type Generic = {
  [key: string]: unknown;
  sortCode?: string;
  accountNumber?: string;
  accountName?: string;
};

export async function encryptPaymentDetails<T extends Generic>(object: T) {
  const result = { ...object };
  if (result.sortCode) {
    result.sortCode = await encryptValue(result.sortCode);
  }
  if (result.accountNumber) {
    result.accountNumber = await encryptValue(result.accountNumber);
  }
  if (result.accountName) {
    result.accountName = await encryptValue(result.accountName);
  }
  return result;
}

export async function decryptPaymentDetails<T extends Generic>(
  object?: T | null
) {
  if (!object) return object;

  const result: T = { ...object };
  if (result.sortCode) {
    result.sortCode = await decryptValue(result.sortCode);
  }
  if (result.accountNumber) {
    result.accountNumber = await decryptValue(result.accountNumber);
  }
  if (result.accountName) {
    result.accountName = await decryptValue(result.accountName);
  }
  return result;
}
