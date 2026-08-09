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
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40"
          >
            <Accordion type="single" collapsible>
              <AccordionItem
                value={`item-${i}`}
                className="border-b-0 px-5"
              >
                <AccordionTrigger className="text-left text-base font-medium text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&[data-state=open]>svg]:rotate-180">
                  {item.q || item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a || item.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </section>
  );
}
