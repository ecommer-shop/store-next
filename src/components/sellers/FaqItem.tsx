'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white/80 dark:bg-[#12123F]/60 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-xl overflow-hidden transition-all hover:border-[#9969F8]/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center gap-4 px-6 py-5 text-left font-semibold text-[#12123F] dark:text-[#F1F1F1] hover:bg-black/5 dark:hover:bg-[#F1F1F1]/5 transition-colors cursor-pointer"
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 text-[#9969F8] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-5 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}