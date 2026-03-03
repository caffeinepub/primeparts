import type { Category, Warranty } from '../backend';

// Format paisa to INR
export function formatPrice(paisa: bigint): string {
  const inr = Number(paisa) / 100;
  return `₹${inr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Convert INR to paisa
export function toPaisa(inr: number): bigint {
  return BigInt(Math.round(inr * 100));
}

// Category display names
export const categoryLabels: Record<Category, string> = {
  ram: 'RAMs',
  ssd: 'SSDs',
  accessory: 'Accessories',
  screen: 'Screens',
  keyboard: 'Keyboards',
  battery: 'Batteries',
};

// Warranty display names
export const warrantyLabels: Record<Warranty, string> = {
  sixMonths: '6 Months',
  twelveMonths: '12 Months',
};

// Warranty price multipliers (12 months adds 10% to price)
export const warrantyMultipliers: Record<Warranty, number> = {
  sixMonths: 1.0,
  twelveMonths: 1.1,
};

export function calculateWarrantyPrice(basePrice: bigint, warranty: Warranty): bigint {
  const multiplier = warrantyMultipliers[warranty];
  return BigInt(Math.round(Number(basePrice) * multiplier));
}
