import React, { Suspense, type ReactNode } from 'react';

/**
 * Props for the branded loading fallback component.
 */
interface LoadingFallbackProps {
  /** User-facing message displayed during loading. */
  message?: string;
}

/**
 * Props for the SuspenseWrapper component.
 */
interface SuspenseWrapperProps {
  /** Child elements to suspend until loaded. */
  children: ReactNode;
  /** Optional custom fallback. Defaults to branded loading indicator. */
  fallback?: ReactNode;
  /** Name for debugging (added as `data-suspend` attribute). */
  name?: string;
}

/**
 * Props for the SectionSuspense component.
 */
interface SectionSuspenseProps {
  /** Child elements (typically a lazy-loaded section). */
  children: ReactNode;
  /** Section name for debugging. */
  name?: string;
}

/**
 * Branded loading indicator using salon design tokens.
 * Uses warm gold color and Cormorant Garamond serif font
 * to maintain brand consistency during loading states.
 *
 * @example
 * ```tsx
 * <LoadingFallback message="Preparing your experience" />
 * ```
 */
const LoadingFallback: React.ComponentType<LoadingFallbackProps> = ({
  message = 'Preparing your experience',
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      minHeight: '200px',
      fontFamily: "'Cormorant Garamond', serif",
    }}
  >
    <div
      style={{
        display: 'flex',
        gap: '0.375rem',
        marginBottom: '1rem',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary, #c9a96e)',
            animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
    <p
      style={{
        color: 'var(--color-muted, #6b7280)',
        fontSize: '0.875rem',
        letterSpacing: '0.05em',
        textAlign: 'center',
        margin: 0,
      }}
    >
      {message}
    </p>
    <style>{`
      @keyframes pulse-dot {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
        40% { opacity: 1; transform: scale(1.2); }
      }
    `}</style>
  </div>
);

LoadingFallback.displayName = 'LoadingFallback';

/**
 * Wraps `React.Suspense` with the branded {@link LoadingFallback}.
 * Adds a `data-suspend` attribute for debugging in the DOM.
 *
 * @example
 * ```tsx
 * <SuspenseWrapper name="ServicesSection">
 *   <LazyServicesSection />
 * </SuspenseWrapper>
 * ```
 */
const SuspenseWrapper: React.ComponentType<SuspenseWrapperProps> = ({
  children,
  fallback,
  name,
}) => (
  <div data-suspend={name}>
    <Suspense fallback={fallback ?? <LoadingFallback />}>
      {children}
    </Suspense>
  </div>
);

SuspenseWrapper.displayName = 'SuspenseWrapper';

/**
 * Convenience wrapper for section-level Suspense with the branded fallback.
 * Automatically applies section-level debugging attributes.
 *
 * @example
 * ```tsx
 * <SectionSuspense name="Gallery">
 *   <LazyGallery />
 * </SectionSuspense>
 * ```
 */
const SectionSuspense: React.ComponentType<SectionSuspenseProps> = ({
  children,
  name,
}) => (
  <SuspenseWrapper
    name={name}
    fallback={
      <LoadingFallback
        message={`Loading ${name ? name.toLowerCase() : 'content'}...`}
      />
    }
  >
    {children}
  </SuspenseWrapper>
);

SectionSuspense.displayName = 'SectionSuspense';

export type {
  LoadingFallbackProps,
  SuspenseWrapperProps,
  SectionSuspenseProps,
};
export { LoadingFallback, SuspenseWrapper, SectionSuspense };
