import React, { useState } from 'react';
import { ServerRule, FaqItem, ServerConfig } from '../types';
import { ShieldCheck, HelpCircle, ChevronDown, ChevronUp, AlertCircle, BookOpen, ShieldAlert } from 'lucide-react';

interface RulesAndFaqProps {
  rules: ServerRule[];
  faqs: FaqItem[];
  config: ServerConfig;
}

export const RulesAndFaq: React.FC<RulesAndFaqProps> = ({ rules, faqs, config }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div id="rules-and-faq-section" className="space-y-10">
      {/* Server Rules Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
            Server Rules & Guidelines
          </h2>
        </div>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Please read and respect these community rules to keep gameplay fair and enjoyable for all.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              id={`rule-item-${rule.id}`}
              className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {rule.category}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-zinc-100 mb-1.5">
                  {rule.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                  {rule.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs font-mono text-rose-300/90 bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/30">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Penalty: {rule.punishment}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-md transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 border-t border-zinc-800/60 leading-relaxed font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
