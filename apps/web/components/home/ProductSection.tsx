// src/components/home/ProductSection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  children: React.ReactNode;
}

export function ProductSection({
  title,
  subtitle,
  viewAllLink,
  children,
}: ProductSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#333333] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#333333]/70 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#333333] hover:text-black transition-colors self-start md:self-auto group"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {children}
      </div>
    </section>
  );
}