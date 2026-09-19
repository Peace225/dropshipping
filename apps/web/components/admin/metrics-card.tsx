"use client";

import { LucideIcon, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  description?: string;
}

export function MetricsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  description,
}: MetricsCardProps) {
  return (
    <div className="rounded-xl border border-[#333333]/10 bg-white p-5 shadow-sm transition-all hover:shadow-md font-sans">
      <div className="flex items-center justify-between">
        {/* Titre de la carte */}
        <p className="text-sm font-semibold text-[#333333]/70">{title}</p>
        
        {/* Icône décorative */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5EBE6] text-[#333333]">
          <Icon className="h-5 w-5 text-[#D4A396]" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        {/* Valeur principale (ex: Chiffre d'affaires) */}
        <h3 className="text-2xl font-bold text-[#333333]">{value}</h3>

        {/* Section Tendance et Description */}
        {(trend || description) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  trendDirection === "up"
                    ? "bg-[#6E857B]/10 text-[#6E857B]" // Vert sage AURAE
                    : trendDirection === "down"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {trendDirection === "up" && <TrendingUp className="h-3 w-3" />}
                {trendDirection === "down" && <TrendingDown className="h-3 w-3" />}
                {trendDirection === "neutral" && <Minus className="h-3 w-3" />}
                {trend}
              </span>
            )}
            
            {description && (
              <p className="text-xs font-medium text-[#333333]/50">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}