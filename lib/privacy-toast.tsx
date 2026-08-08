import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function privacyToast(message?: string, description?: string) {
  toast.success(message ?? 'Processed 100% locally in browser', {
    description: description ?? '0 KB uploaded to servers.',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    style: {
      background: '#151B2B',
      border: '1px solid rgb(16 185 129 / 0.4)',
      color: '#fff',
    },
  });
}

export function privacyToastNode(icon: ReactNode, message: string, description?: string) {
  toast(message, {
    description,
    icon,
    style: {
      background: '#151B2B',
      border: '1px solid rgb(16 185 129 / 0.4)',
      color: '#fff',
    },
  });
}
