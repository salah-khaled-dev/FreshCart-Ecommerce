import React from "react";
import { promoItems } from "@/api/types";


export default function PromoBanners() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {promoItems.map((item) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${item.gradientClass} p-8 text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  <span>{item.badgeIcon}</span>
                  <span>{item.badgeText}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {item.title}
                </h3>

                <p className="text-white/80 mb-4">{item.description}</p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold">{item.discount}</div>
                  <div className="text-sm text-white/70">
                    Use code:{' '}
                    <span className="font-bold text-white">
                      {item.couponCode}
                    </span>
                  </div>
                </div>

                <a
                  className={`inline-flex items-center gap-2 bg-white ${item.buttonTextColorClass} px-6 py-3 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 group/btn`}
                  href={item.buttonHref}
                >
                  {item.buttonText}
                  <svg
                    className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 duration-200"
                    role="img"
                    viewBox="0 0 512 512"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}