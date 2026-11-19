import React from "react";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export default function TrustFeatures() {
  const features = [
    {
      title: "Free Shipping",
      subtitle: "On orders over 500 EGP",
      icon: Truck,
      bg: "bg-[#e0f2fe]",
      color: "text-[#0284c7]",
    },
    {
      title: "Secure Payment",
      subtitle: "100% secure transactions",
      icon: ShieldCheck,
      bg: "bg-[#dcfce7]",
      color: "text-[#16a34a]",
    },
    {
      title: "Easy Returns",
      subtitle: "14-day return policy",
      icon: RotateCcw,
      bg: "bg-[#fef3c7]",
      color: "text-[#d97706]",
    },
    {
      title: "24/7 Support",
      subtitle: "Dedicated support team",
      icon: Headphones,
      bg: "bg-[#f3e8ff]",
      color: "text-[#9333ea]",
    },
  ];

  return (
    <section className="max-w-[1320px] mx-auto px-4 pt-6 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 ease-out group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-full ${feature.bg} ${feature.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ease-out`}
              >
                <Icon className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-[14px] font-bold text-[#1e293b]">
                  {feature.title}
                </h4>
                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { TrustFeatures };
