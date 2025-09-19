import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats product code and variation code into the standard format
 * @param productCode - The 6-digit product code
 * @param variationCode - The 3-digit variation code
 * @returns Formatted code string (e.g., "123456-101") or "N/A" if codes are missing
 */
export function formatProductCode(productCode?: string, variationCode?: string): string {
  if (productCode && variationCode) {
    return `${productCode}-${variationCode}`
  } else if (productCode) {
    return productCode
  }
  return 'N/A'
}
