import React from 'react';
import { Icon } from 'supadocs/client/components/Icon';
import { ArrowRight } from 'lucide-react';

interface LandingConfig {
  headline?: string;
  description?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  cards?: { title: string; description: string; icon?: string; href?: string }[];
}

interface LandingProps {
  config: any;
}

export function Landing({ config }: LandingProps) {
  const landing: LandingConfig = config.landing || {};
  const name = config.name || 'Documentation';

  return (
    <div className="sd-landing">
      <div className="sd-landing-header">
        <h1 className="sd-landing-title">
          {landing.headline || `${name} Documentation`}
        </h1>
        {landing.description && (
          <p className="sd-landing-desc">{landing.description}</p>
        )}
        <div className="sd-landing-actions">
          {landing.primaryAction && (
            <a href={landing.primaryAction.href} className="sd-landing-btn sd-landing-btn-primary">
              {landing.primaryAction.label}
              <ArrowRight size={14} strokeWidth={2} />
            </a>
          )}
          {landing.secondaryAction && (
            <a href={landing.secondaryAction.href} className="sd-landing-btn sd-landing-btn-secondary">
              {landing.secondaryAction.label}
            </a>
          )}
        </div>
      </div>

      {landing.cards && landing.cards.length > 0 && (
        <div className="sd-landing-cards">
          {landing.cards.map((card, i) => {
            const inner = (
              <>
                {card.icon && (
                  <div className="sd-landing-card-icon">
                    <Icon name={card.icon} size={22} strokeWidth={1.5} />
                  </div>
                )}
                <div className="sd-landing-card-title">{card.title}</div>
                <div className="sd-landing-card-desc">{card.description}</div>
              </>
            );

            if (card.href) {
              return <a key={i} href={card.href} className="sd-landing-card">{inner}</a>;
            }
            return <div key={i} className="sd-landing-card">{inner}</div>;
          })}
        </div>
      )}
    </div>
  );
}
