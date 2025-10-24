'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title: string;
  items: FAQItem[];
}

// Chevron 아이콘 컴포넌트들
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

export default function FAQ({ title, items }: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="relative bg-surface py-16 md:py-32 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-textPrimary mb-4 md:mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-textSecondary max-w-3xl mx-auto">
            TOTARO 서비스에 대해 자주 묻는 질문들을 확인해보세요
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-bg rounded-lg border border-line overflow-hidden"
            >
              <button
                className="w-full px-6 md:px-8 py-4 md:py-6 text-left flex justify-between items-center hover:bg-surface/50 group"
                onClick={() => toggleItem(index)}
              >
                <span className="text-lg md:text-xl font-semibold text-textPrimary pr-4 group-hover:text-accent">
                  {item.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20">
                  {openItems.includes(index) ? (
                    <ChevronUpIcon className="h-5 w-5 text-accent" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-accent" />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 md:px-8 pb-4 md:pb-6 border-t border-line/50">
                  <div className="pt-4 md:pt-6 text-textSecondary leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-bg rounded-lg border border-line p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-textPrimary mb-3">
              더 궁금한 점이 있으신가요?
            </h3>
            <p className="text-textSecondary mb-6">
              전문 상담사가 직접 답변드리겠습니다
            </p>
            <a
              href="#contact"
              className="btn-primary text-base md:text-lg px-8 md:px-10 py-3 md:py-4 shadow-soft hover:shadow-lg inline-block"
            >
              문의하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
