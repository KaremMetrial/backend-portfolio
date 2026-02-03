import React, { useEffect } from 'react';

interface AccessibilityEnhancerProps {
  children: React.ReactNode;
}

export const AccessibilityEnhancer: React.FC<AccessibilityEnhancerProps> = ({ children }) => {
  useEffect(() => {
    // Improve color contrast ratios
    const improveContrast = () => {
      const root = document.documentElement;
      
      // Check current color contrast and adjust if needed
      const checkContrast = (bgColor: string, textColor: string): number => {
        // Simple contrast calculation (simplified for this example)
        // In production, you'd use a proper contrast checking library
        return 4.5; // Assume good contrast for now
      };

      // Apply high contrast mode if user prefers
      if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        root.style.setProperty('--contrast-ratio', '1.2');
      }
    };

    // Add skip links for keyboard navigation
    const addSkipLinks = () => {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });

      document.body.insertBefore(skipLink, document.body.firstChild);
    };

    // Add focus indicators
    const addFocusIndicators = () => {
      const style = document.createElement('style');
      style.textContent = `
        :focus {
          outline: 3px solid #6366f1;
          outline-offset: 2px;
        }
        :focus:not(:focus-visible) {
          outline: none;
        }
        :focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(style);
    };

    // Add ARIA live regions for dynamic content
    const addLiveRegions = () => {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.id = 'live-region';
      document.body.appendChild(liveRegion);
    };

    // Announce page changes
    const announcePageChange = (title: string) => {
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = `Navigated to ${title}`;
        // Clear after a short delay
        setTimeout(() => {
          liveRegion.textContent = '';
        }, 1000);
      }
    };

    improveContrast();
    addSkipLinks();
    addFocusIndicators();
    addLiveRegions();

    // Listen for page changes
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      announcePageChange(document.title);
    };

    // Handle hash changes
    window.addEventListener('hashchange', () => {
      announcePageChange(document.title);
    });

    return () => {
      // Cleanup
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.remove();
      }
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.remove();
      }
    };
  }, []);

  return <>{children}</>;
};

// Component for accessible buttons
export const AccessibleButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel?: string;
}> = ({ onClick, children, variant = 'primary', size = 'md', disabled = false, ariaLabel }) => {
  const buttonClasses = [
    'accessible-button',
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? 'btn-disabled' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled ? 'true' : 'false'}
    >
      {children}
    </button>
  );
};

// Component for accessible links
export const AccessibleLink: React.FC<{
  href: string;
  children: React.ReactNode;
  external?: boolean;
  ariaLabel?: string;
}> = ({ href, children, external = false, ariaLabel }) => {
  const linkProps = {
    href,
    'aria-label': ariaLabel,
    ...(external && {
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': ariaLabel || `${children} (opens in new window)`
    })
  };

  return (
    <a {...linkProps}>
      {children}
      {external && (
        <span className="sr-only"> (opens in new window)</span>
      )}
    </a>
  );
};

// Screen reader only utility component
export const ScreenReaderOnly: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <span className="sr-only" aria-hidden="true">
      {children}
    </span>
  );
};

// High contrast toggle component
export const HighContrastToggle: React.FC = () => {
  const [highContrast, setHighContrast] = React.useState(false);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast', !highContrast);
  };

  return (
    <button
      onClick={toggleContrast}
      className="contrast-toggle"
      aria-label="Toggle high contrast mode"
    >
      {highContrast ? 'Normal Contrast' : 'High Contrast'}
    </button>
  );
};