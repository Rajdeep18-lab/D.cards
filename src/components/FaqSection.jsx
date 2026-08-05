import React from 'react';
import { faqs } from '../data/mockData';

function FaqSection() {
  return (
    <section className="py-12 border-t border-highlight dark:border-darkHighlight">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent mb-2">Frequently Asked Questions</h2>
        <p className="text-sm text-textSoft dark:text-gray-400">Everything you need to know about comparing debit cards.</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-cardBg dark:bg-darkCard rounded-xl p-5 shadow-sm border border-highlight dark:border-darkHighlight transition-colors">
            <h3 className="font-semibold text-textDark dark:text-white mb-2">{faq.q}</h3>
            <p className="text-sm text-textSoft dark:text-gray-300 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
