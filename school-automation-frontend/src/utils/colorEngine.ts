// src/utils/colorEngine.ts
import { DerivedPalette } from '@/types/theme';

function normalizeHex(hex: string): string {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  return clean.length === 6 ? clean : '1E3A8A';
}

export function adjustLuminance(hex: string, delta: number): string {
  const clean = normalizeHex(hex);
  let rgb = '#';
  for (let i = 0; i < 3; i++) {
    const channel = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
    const adjusted = Math.round(Math.min(Math.max(0, channel + channel * delta), 255));
    rgb += adjusted.toString(16).padStart(2, '0');
  }
  return rgb;
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = normalizeHex(hex);
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getContrastTextColor(hex: string): string {
  const clean = normalizeHex(hex);
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.45 ? '#0F172A' : '#FFFFFF';
}

export function generateDerivedPalette(primaryHex: string): DerivedPalette {
  return {
    primary: primaryHex,
    primaryHover: adjustLuminance(primaryHex, -0.12),
    primarySubtle: hexToRgba(primaryHex, 0.06),
    primaryBorder: hexToRgba(primaryHex, 0.18),
    textOnPrimary: getContrastTextColor(primaryHex),
  };
}