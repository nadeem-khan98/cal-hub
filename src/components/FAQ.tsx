import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

export default function FAQ({ faqs }: FAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className={`${index !== 0 ? "pt-6 border-t border-gray-100 dark:border-gray-800/50" : ""}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
