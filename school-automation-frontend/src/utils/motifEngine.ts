// src/utils/motifEngine.ts
import { BrandMotif } from '@/types/theme';

export function getMotifPatternSvg(motif: BrandMotif = 'collegiate-stripe', colorHex = '#FFFFFF'): string {
  const cleanColor = colorHex.replace('#', '%23');

  switch (motif) {
    case 'collegiate-stripe':
      // 45-degree angled collegiate pinstripes
      return `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='${cleanColor}' fill-rule='evenodd'/%3E%3C/svg%3E`;

    case 'heritage-quatrefoil':
      // Cathedral Gothic quatrefoil / chapel arch motif
      return `data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0a12 12 0 0 0 12 12 12 12 0 0 0 12-12v48a12 12 0 0 0-12-12 12 12 0 0 0-12 12 12 12 0 0 0-12-12 12 12 0 0 0-12 12V0a12 12 0 0 0 12 12A12 12 0 0 0 24 0z' fill='${cleanColor}' fill-rule='evenodd' fill-opacity='0.6'/%3E%3C/svg%3E`;

    case 'tech-grid':
      // Micro-blueprint technical grid for science and STEM schools
      return `data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h32v32H0V0zm1 1v30h30V1H1z' fill='${cleanColor}' fill-rule='evenodd'/%3E%3C/svg%3E`;

    case 'organic-topo':
      // Soft contour curves for primary and early childhood schools
      return `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20zm0 4c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm0 6c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z' fill='${cleanColor}' fill-rule='evenodd' fill-opacity='0.4'/%3E%3C/svg%3E`;

    case 'minimal-dots':
    default:
      // High-precision micro dots
      return `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='${cleanColor}'/%3E%3C/svg%3E`;
  }
}