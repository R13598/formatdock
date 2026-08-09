'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, PenLine, FileText, Calculator } from 'lucide-react';

type Pill = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

export default function QuickFilterPills() {
  const router = useRouter();
  const pills: Pill[] = [
    {
      label: 'UPSC 350x350',
      icon: <Camera className="h-3.5 w-3.5" />,
      href: '/tools/upsc-photo-resizer',
    },
    {
      label: 'SSC Signature 20KB',
      icon: <PenLine className="h-3.5 w-3.5" />,
      href: '/tools/ssc-image-compressor',
    },
    {
      label: 'CTET Photo 300x300',
      icon: <FileText className="h-3.5 w-3.5" />,
      href: '/tools/ctet-photo-format',
    },
    {
      label: 'GST / Score Tools',
      icon: <Calculator className="h-3.5 w-3.5" />,
      href: '/calculators',
    },
  ];

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Quick Select:
      </span>
      {pills.map((p) => (
        <button
          key={p.href}
          onClick={() => router.push(p.href)}
          className="group inline-flex items-center gap-1.5 rounded-full border border-[#1e293b] bg-[#0f172a] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white hover:shadow-md"
        >
          <span className="text-[#3B82F6] transition-colors group-hover:text-white">
            {p.icon}
          </span>
          {p.label}
        </button>
      ))}
    </div>
  );
}
