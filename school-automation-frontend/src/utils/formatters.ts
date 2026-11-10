// src/utils/formatters.ts
export function formatNaira(amountInNaira: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amountInNaira);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getGradeBadgeStyle(grade: string): string {
  switch (grade.toUpperCase()) {
    case 'A':
    case 'A1':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'B':
    case 'B2':
    case 'B3':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'C':
    case 'C4':
    case 'C5':
    case 'C6':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-rose-50 text-rose-700 border-rose-200';
  }
}