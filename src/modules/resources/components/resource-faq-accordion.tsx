"use client";

import React, { useState } from "react";
import { ResourceFaq } from "../types";
import { HelpCircle, ChevronDown } from "lucide-react";

interface ResourceFaqAccordionProps {
  faqs: ResourceFaq[];
  isHindi?: boolean;
}

export function ResourceFaqAccordion({ faqs, isHindi = false }: ResourceFaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0])); // Open first FAQ by default

  if (!faqs || faqs.length === 0) return null;

  function toggleIndex(idx: number) {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-5" aria-labelledby="faq-heading">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <HelpCircle className="h-5 w-5 text-[#013089]" />
        <div>
          <h2 id="faq-heading" className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
            {isHindi ? "अक्सर पूछे जाने वाले प्रश्न (FAQ)" : "Frequently Asked Questions & Answers"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHindi ? "उम्मीदवारों द्वारा पूछे गए प्रमुख सवालों के आधिकारिक उत्तर" : "Verified answers to top candidate inquiries on this career track"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndexes.has(idx);
          const qText = isHindi && faq.question_hi ? faq.question_hi : faq.question;
          const aText = isHindi && faq.answer_hi ? faq.answer_hi : faq.answer;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                isOpen ? "border-slate-300 bg-slate-50/50 shadow-2xs" : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="flex w-full items-center justify-between p-4 text-left font-semibold text-slate-900 text-sm sm:text-base focus:outline-hidden"
                aria-expanded={isOpen}
              >
                <span className="pr-4 leading-snug">{qText}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#013089]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  <p>{aText}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
