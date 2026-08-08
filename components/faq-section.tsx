'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import type { FaqItem } from '@/lib/tools';

export default function FaqSection({
  items,
  title = 'Frequently Asked Questions',
}: {
  items: FaqItem[];
  title?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-[#3B82F6]" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-[#252D3D] bg-[#151B2B] backdrop-blur-sm transition-colors duration-300 hover:border-[#3B82F6]/30"
          >
            <Accordion type="single" collapsible>
              <AccordionItem
                value={`item-${i}`}
                className="border-b-0 px-5"
              >
                <AccordionTrigger className="text-left text-base font-medium text-slate-200 transition-colors duration-200 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151B2B] [&[data-state=open]>svg]:rotate-180">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-slate-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </section>
  );
}
