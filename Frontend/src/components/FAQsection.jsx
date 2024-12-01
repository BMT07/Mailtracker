import React, { useState } from 'react';

export const FAQSection = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleSection = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="bg-[#F0F8FF] rounded-[45px] px-6 sm:mx-6 md:mx-11 py-10 sm:py-14 lg:mx-8 max-w-auto">
      {[
        {
          question: 'How does the mail tracker extension work?',
          answer:
            'Our mail tracker extension integrates seamlessly with Gmail to provide real-time tracking of your sent emails. It notifies you when your emails are opened and read. The extension works by embedding a small, invisible tracking pixel in your emails, which notifies our system when the email is opened. This data is then presented in your dashboard for easy access and review.',
        },
        {
          question: 'Is my email data secure?',
          answer:
            'Yes, we prioritize your data security. All tracking data is encrypted and only accessible to you through your account dashboard. We do not share your data with third parties.',
        },
        {
          question: 'Can I track emails from other email providers?',
          answer:
            'Currently, our extension is designed for Gmail. However, we are actively working on supporting other major email providers in the future.',
        },
        {
          question: 'What happens if I exceed the tracked emails limit?',
          answer:
            'If you exceed the limit, tracking will be paused until the next billing cycle. You can also upgrade your plan to increase your tracking quota.',
        },
      ].map((item, index) => (
        <div key={index} className="space-y-4">
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            {/* Numéro dynamique */}
            <span
              className={`text-customBlue font-space-mono text-lg ${
                expanded === index
                  ? 'block sm:static sm:translate-y-0 mb-2 sm:mb-0'
                  : 'block sm:inline sm:mr-4'
              }`}
            >
              {`0${index + 1}.`}
            </span>

            {/* Question */}
            <h3 className="text-[#1B0454] font-semibold text-lg sm:text-xl w-full sm:w-3/4 lg:px-0">
              {item.question}
            </h3>

            {/* Bouton + ou × */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mt-4 sm:mt-0 ${
                expanded === index ? 'bg-[#1B0454]' : 'bg-[#FC4A1A33]'
              }`}
            >
              <span
                className={`text-lg font-bold ${
                  expanded === index ? 'text-white' : 'text-[#1B0454]'
                }`}
              >
                {expanded === index ? '×' : '+'}
              </span>
            </div>
          </div>

          {/* Texte déplié */}
          {expanded === index && (
            <div className="relative">
              <p className="text-[#6C6384] text-sm sm:text-base leading-relaxed w-full sm:w-3/4 lg:px-8">
                {item.answer}
              </p>
            </div>
          )}

          <div className="h-[2px] bg-white my-6"></div>
        </div>
      ))}
    </div>
  );
};
