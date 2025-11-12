export type HoodieColor = 'green' | 'white' | 'black';

export interface Hoodie {
  id: HoodieColor;
  name: string;
  baseColorClass: string;
  selectedRingClass: string;
  // Fix: Add optional image property to store reference hoodie image
  image?: string;
}
