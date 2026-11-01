'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SignatureHeroCardProps {
  title: string;
  description?: string;
  tagBadge?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function SignatureHeroCard({
  title,
  description,
  tagBadge = 'Synergy Marketing Operations',
  primaryAction,
  secondaryAction,
}: SignatureHeroCardProps) {
  return (
    <div className="panel-hero-card">
      <div className="relative z-10 max-w-[740px]">
        <div className="panel-hero-tag">
          <Sparkles className="w-3 h-3 text-blue-300" />
          <span>{tagBadge}</span>
        </div>
        <h1 className="panel-hero-title">{title}</h1>
        {description && <p className="panel-hero-desc">{description}</p>}
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="panel-hero-actions relative z-10 flex items-center gap-2.5">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
}

