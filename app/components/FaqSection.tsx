import { ChevronDown } from "lucide-react";
import { faqItems } from "../faq-data";

export function FaqSection() {
  return (
    <div id="faq" className="py-24 border-t border-gray-100">
      <h2 className="text-4xl md:text-5xl tracking-tight text-gray-900 font-medium mb-4 font-serif text-center">
        FAQ
      </h2>
      <p className="text-center text-gray-500 font-montserrat max-w-2xl mx-auto mb-14 leading-relaxed">
        Straight answers on how fractional CTO support works in Macao—before you book a health check.
      </p>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {faqItems.map((item) => (
          <details
            key={item.question}
            className="group rounded-3xl bg-white border border-gray-100 p-6 md:p-8 shadow-sm hover:border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-montserrat font-medium text-gray-900 text-left [&::-webkit-details-marker]:hidden">
              <span className="text-sm md:text-base leading-snug">{item.question}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="mt-4 text-sm text-gray-500 font-montserrat leading-relaxed pr-1 md:pr-4">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
