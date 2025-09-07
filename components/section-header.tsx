import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="py-12 text-center">
      <h2 className="text-3xl font-semibold text-text-primary relative inline-block">
        {title}
        <span className="block h-1 w-16 bg-primary mx-auto mt-2"></span>
      </h2>
      <p className="mt-3 text-base text-text-muted max-w-xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}
