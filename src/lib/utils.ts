export function formatPrice(amount: number, currency = 'ج.م'): string {
  return `${amount.toLocaleString('ar-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '⏳ قيد الانتظار',
    confirmed: '✅ مؤكد',
    processing: '⚙️ قيد المعالجة',
    shipped: '🚚 تم الشحن',
    delivered: '📦 تم التوصيل',
    cancelled: '❌ ملغي',
    rejected: '🚫 مرفوض',
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}