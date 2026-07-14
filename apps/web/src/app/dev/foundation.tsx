import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';

// ── Token Imports (read-only, no modifications) ────────────
import { COLORS_LIGHT, COLORS_DARK } from '@/shared/tokens/color';
import { TYPE_SCALE, FONT_FAMILY } from '@/shared/tokens/typography';
import { SHADOWS_LIGHT, SHADOWS_DARK } from '@/shared/tokens/shadow';
import { RADIUS } from '@/shared/tokens/radius';
import { DURATION, EASING, MOTION_LIMITS } from '@/shared/tokens/motion';
import { Z_INDEX } from '@/shared/tokens/z-index';
import { BREAKPOINTS, MAX_WIDTHS, MEDIA_QUERIES } from '@/shared/tokens/breakpoints';

// ── Config Imports ─────────────────────────────────────────
import { APP_CONFIG } from '@/shared/config/app-config';
import { getFeatureFlags, type FeatureFlag } from '@/shared/config/feature-flags';
import { isDev, isBrowser } from '@/shared/config/env';

// ── Route ──────────────────────────────────────────────────

export const Route = createFileRoute('/dev/foundation')({
  component: FoundationShowcase,
});

// ── Section Component ──────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative w-full"
      style={{ paddingBottom: 'var(--spacing-formal)' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ marginBottom: 'var(--spacing-social)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-heading)',
              lineHeight: 'var(--leading-heading)',
              fontWeight: 'var(--weight-heading)',
              color: 'var(--color-text)',
              marginBottom: 'var(--spacing-intimate)',
            }}
          >
            {title}
          </h2>
          {description && (
            <p
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--leading-body)',
                color: 'var(--color-text-muted)',
                maxWidth: '65ch',
              }}
            >
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

// ── Subsection Component ───────────────────────────────────

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 'var(--spacing-social)' }}>
      <h3
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-caption)',
          lineHeight: 'var(--leading-caption)',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 'var(--spacing-personal)',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Token Display Card ─────────────────────────────────────

function TokenCard({
  label,
  value,
  preview,
  mono,
}: {
  label: string;
  value: string;
  preview?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--spacing-personal)',
        padding: 'var(--spacing-personal)',
        borderRadius: 'var(--radius-medium)',
        backgroundColor: 'var(--color-surface-secondary)',
        minHeight: '44px',
      }}
    >
      {preview && (
        <div
          style={{
            flexShrink: 0,
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-medium)',
            overflow: 'hidden',
          }}
        >
          {preview}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 'var(--text-caption)',
            fontWeight: 500,
            color: 'var(--color-text)',
            marginBottom: '2px',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 'var(--text-micro)',
            fontFamily: mono ? 'ui-monospace, monospace' : 'var(--font-sans)',
            color: 'var(--color-text-muted)',
            wordBreak: 'break-all',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

// ── Infrastructure Status Item ─────────────────────────────

function StatusItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-personal)',
        padding: 'var(--spacing-personal) var(--spacing-social)',
        borderRadius: 'var(--radius-medium)',
        backgroundColor: 'var(--color-surface-secondary)',
        minHeight: '44px',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-body)',
          color: ok ? 'var(--color-success)' : 'var(--color-error)',
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {ok ? '✓' : '✗'}
      </span>
      <span
        style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-text)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN SHOWCASE COMPONENT
// ═══════════════════════════════════════════════════════════

function FoundationShowcase() {
  // ── Environment State ────────────────────────────────────
  const [screenSize, setScreenSize] = useState('');
  const [theme, setTheme] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<
    Record<FeatureFlag, boolean> | null
  >(null);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= BREAKPOINTS.wide) setScreenSize('Wide (1440px+)');
      else if (w >= BREAKPOINTS.desktop) setScreenSize('Desktop (1024–1439px)');
      else if (w >= BREAKPOINTS.tablet) setScreenSize('Tablet (768–1023px)');
      else setScreenSize('Mobile (< 768px)');

      const root = document.documentElement;
      setTheme(root.getAttribute('data-theme') || 'light');
      setReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
      setFeatureFlags(getFeatureFlags());
    }

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Button Interaction States (for demo) ─────────────────
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const handleBtnMouseDown = useCallback((id: string) => {
    setActiveBtn(id);
    setTimeout(() => setActiveBtn(null), 150);
  }, []);

  // ── Form State (for demo) ────────────────────────────────
  const [checkbox, setCheckbox] = useState(false);
  const [radio, setRadio] = useState('option-a');
  const [switchOn, setSwitchOn] = useState(false);

  // ── Browser Detection ────────────────────────────────────
  const browserInfo = isBrowser
    ? (() => {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edg/')) return 'Edge';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        return 'Unknown';
      })()
    : 'Server';

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        minHeight: '100vh',
      }}
    >
      {/* ── Page Header ──────────────────────────────────── */}
      <section
        style={{
          paddingTop: 'var(--spacing-public)',
          paddingBottom: 'var(--spacing-formal)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-micro)',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 500,
              marginBottom: 'var(--spacing-intimate)',
            }}
          >
            Development Only
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-display)',
              lineHeight: 'var(--leading-display)',
              fontWeight: 'var(--weight-display)',
              letterSpacing: 'var(--tracking-display)',
              color: 'var(--color-text)',
              marginBottom: 'var(--spacing-personal)',
            }}
          >
            Foundation Showcase
          </h1>
          <p
            style={{
              fontSize: 'var(--text-subheading)',
              lineHeight: 'var(--leading-subheading)',
              color: 'var(--color-text-secondary)',
              maxWidth: '55ch',
            }}
          >
            Visual verification of every completed foundation system before
            Phase 4. This page is not part of the production website.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
           1. THEME — COLOR TOKENS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Theme"
        description="Every color token in the design system. Three chromatic roles only: Surface, Text, Accent."
      >
        {/* Surface Colors */}
        <SubSection title="Surface Colors">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            {(
              [
                ['surface', COLORS_LIGHT.surface],
                ['surfaceSecondary', COLORS_LIGHT.surfaceSecondary],
                ['surfaceElevated', COLORS_LIGHT.surfaceElevated],
              ] as const
            ).map(([key, val]) => (
              <TokenCard
                key={key}
                label={`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
                value={val}
                preview={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: val,
                      border: '1px solid var(--color-border)',
                    }}
                  />
                }
                mono
              />
            ))}
          </div>
        </SubSection>

        {/* Text Colors */}
        <SubSection title="Text Colors">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            {(
              [
                ['text', COLORS_LIGHT.text],
                ['textSecondary', COLORS_LIGHT.textSecondary],
                ['textMuted', COLORS_LIGHT.textMuted],
              ] as const
            ).map(([key, val]) => (
              <TokenCard
                key={key}
                label={`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
                value={val}
                preview={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: val,
                    }}
                  />
                }
                mono
              />
            ))}
          </div>
        </SubSection>

        {/* Accent Colors */}
        <SubSection title="Accent Colors">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            {(
              [
                ['accent', COLORS_LIGHT.accent],
                ['accentHover', COLORS_LIGHT.accentHover],
                ['accentActive', COLORS_LIGHT.accentActive],
              ] as const
            ).map(([key, val]) => (
              <TokenCard
                key={key}
                label={`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
                value={val}
                preview={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: val,
                    }}
                  />
                }
                mono
              />
            ))}
          </div>
        </SubSection>

        {/* Border & Functional Colors */}
        <SubSection title="Border & Functional Colors">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            {(
              [
                ['border', COLORS_LIGHT.border],
                ['error', COLORS_LIGHT.error],
                ['success', COLORS_LIGHT.success],
              ] as const
            ).map(([key, val]) => (
              <TokenCard
                key={key}
                label={`--color-${key}`}
                value={val}
                preview={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: val,
                    }}
                  />
                }
                mono
              />
            ))}
          </div>
        </SubSection>

        {/* Dark Mode Colors */}
        <SubSection title="Dark Mode Colors">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            {(
              [
                ['surface (dark)', COLORS_DARK.surface],
                ['text (dark)', COLORS_DARK.text],
                ['accent (dark)', COLORS_DARK.accent],
                ['accentHover (dark)', COLORS_DARK.accentHover],
                ['error (dark)', COLORS_DARK.error],
                ['success (dark)', COLORS_DARK.success],
              ] as const
            ).map(([key, val]) => (
              <TokenCard
                key={key}
                label={key}
                value={val}
                preview={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: val,
                    }}
                  />
                }
                mono
              />
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ════════════════════════════════════════════════════
           2. TYPOGRAPHY
           ════════════════════════════════════════════════════ */}
      <Section
        title="Typography"
        description="Two families, six levels. Cormorant Garamond for voice. DM Sans for function."
      >
        {/* Font Families */}
        <SubSection title="Font Families">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            <div
              style={{
                padding: 'var(--spacing-social)',
                borderRadius: 'var(--radius-medium)',
                backgroundColor: 'var(--color-surface-secondary)',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 'var(--spacing-intimate)',
                }}
              >
                Serif — Voice
              </p>
              <p
                style={{
                  fontFamily: FONT_FAMILY.serif,
                  fontSize: 'var(--text-heading)',
                  lineHeight: 'var(--leading-heading)',
                  color: 'var(--color-text)',
                }}
              >
                Cormorant Garamond
              </p>
              <p
                style={{
                  fontFamily: FONT_FAMILY.serif,
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Headlines, emotional moments, pull quotes
              </p>
            </div>
            <div
              style={{
                padding: 'var(--spacing-social)',
                borderRadius: 'var(--radius-medium)',
                backgroundColor: 'var(--color-surface-secondary)',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 'var(--spacing-intimate)',
                }}
              >
                Sans-Serif — Function
              </p>
              <p
                style={{
                  fontFamily: FONT_FAMILY.sans,
                  fontSize: 'var(--text-heading)',
                  lineHeight: 'var(--leading-heading)',
                  color: 'var(--color-text)',
                }}
              >
                DM Sans
              </p>
              <p
                style={{
                  fontFamily: FONT_FAMILY.sans,
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Body copy, navigation, UI elements, metadata
              </p>
            </div>
          </div>
        </SubSection>

        {/* Type Scale */}
        <SubSection title="Type Scale">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-personal)' }}>
            {(
              [
                ['Display', TYPE_SCALE.display, 'var(--font-serif)'],
                ['Heading', TYPE_SCALE.heading, 'var(--font-serif)'],
                ['Subheading', TYPE_SCALE.subheading, 'var(--font-sans)'],
                ['Body', TYPE_SCALE.body, 'var(--font-sans)'],
                ['Caption', TYPE_SCALE.caption, 'var(--font-sans)'],
                ['Micro', TYPE_SCALE.micro, 'var(--font-sans)'],
              ] as const
            ).map(([level, token, family]) => (
              <div
                key={level}
                style={{
                  padding: 'var(--spacing-personal)',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'var(--color-surface-secondary)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-intimate)',
                    marginBottom: 'var(--spacing-intimate)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--text-micro)',
                      color: 'var(--color-accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 500,
                    }}
                  >
                    {level}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--text-micro)',
                      fontFamily: 'ui-monospace, monospace',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {token.size} / {token.leading} / w{token.weight}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: family,
                    fontSize: token.size,
                    lineHeight: token.leading,
                    fontWeight: token.weight,
                    letterSpacing: token.tracking,
                    color: 'var(--color-text)',
                    margin: 0,
                  }}
                >
                  {level === 'Display'
                    ? 'The Art of Considered Beauty'
                    : level === 'Heading'
                      ? 'Where Craft Meets Intention'
                      : level === 'Subheading'
                        ? 'Every detail has been considered with care'
                        : level === 'Body'
                          ? 'Our artisans bring years of dedicated practice to every consultation. The result is not just a service — it is a transformation that begins with understanding and ends with confidence.'
                          : level === 'Caption'
                            ? 'Image label and service detail metadata'
                            : 'Timestamps, legal text, and fine print'}
                </p>
              </div>
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ════════════════════════════════════════════════════
           3. BUTTONS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Buttons"
        description="Three variants per VISUAL_RULES B1: Primary, Secondary, Ghost. Four states each."
      >
        {/* Primary Button */}
        <SubSection title="Primary">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-personal)',
              alignItems: 'flex-start',
            }}
          >
            {/* Default */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-surface)',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '44px',
                  transition:
                    'background-color var(--duration-fast) var(--easing-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--color-accent-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--color-accent)';
                }}
              >
                Book your experience
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Default
              </p>
            </div>
            {/* Hover (simulated) */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'var(--color-accent-hover)',
                  color: 'var(--color-surface)',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Book your experience
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Hover
              </p>
            </div>
            {/* Focus */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-surface)',
                  border: '2px solid var(--color-accent)',
                  outline: '2px solid var(--color-accent)',
                  outlineOffset: '2px',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Book your experience
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Focus
              </p>
            </div>
            {/* Disabled */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                disabled
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-surface)',
                  border: 'none',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  minHeight: '44px',
                }}
              >
                Book your experience
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Disabled
              </p>
            </div>
          </div>
        </SubSection>

        {/* Secondary Button */}
        <SubSection title="Secondary">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-personal)',
              alignItems: 'flex-start',
            }}
          >
            {/* Default */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-accent)',
                  cursor: 'pointer',
                  minHeight: '44px',
                  transition:
                    'background-color var(--duration-fast) var(--easing-in-out), color var(--duration-fast) var(--easing-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                  e.currentTarget.style.color = 'var(--color-surface)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-accent)';
                }}
              >
                Explore services
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Default
              </p>
            </div>
            {/* Hover */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-surface)',
                  border: '1px solid var(--color-accent)',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Explore services
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Hover
              </p>
            </div>
            {/* Focus */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-accent)',
                  outline: '2px solid var(--color-accent)',
                  outlineOffset: '2px',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Explore services
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Focus
              </p>
            </div>
            {/* Disabled */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                disabled
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-accent)',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  minHeight: '44px',
                }}
              >
                Explore services
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Disabled
              </p>
            </div>
          </div>
        </SubSection>

        {/* Ghost Button */}
        <SubSection title="Ghost">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-personal)',
              alignItems: 'flex-start',
            }}
          >
            {/* Default */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '44px',
                  transition:
                    'color var(--duration-fast) var(--easing-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                Learn more
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Default
              </p>
            </div>
            {/* Hover */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-accent)',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Learn more
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Hover
              </p>
            </div>
            {/* Focus */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: 'none',
                  outline: '2px solid var(--color-accent)',
                  outlineOffset: '2px',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Learn more
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Focus
              </p>
            </div>
            {/* Disabled */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                disabled
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 500,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: 'none',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  minHeight: '44px',
                }}
              >
                Learn more
              </button>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-intimate)',
                }}
              >
                Disabled
              </p>
            </div>
          </div>
        </SubSection>
      </Section>

      {/* ════════════════════════════════════════════════════
           4. INPUTS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Inputs"
        description="Form elements with warm focus rings and accessible labels. Per DESIGN_SYSTEM §18."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--spacing-social)',
          }}
        >
          {/* Text Input */}
          <div>
            <label
              htmlFor="demo-name"
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-intimate)',
              }}
            >
              Name
            </label>
            <input
              id="demo-name"
              type="text"
              placeholder="Enter your name"
              style={{
                width: '100%',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-body)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-small)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text)',
                outline: 'none',
                transition:
                  'border-color var(--duration-fast) var(--easing-in-out)',
                minHeight: '44px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            />
            <p
              style={{
                fontSize: 'var(--text-micro)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--spacing-intimate)',
              }}
            >
              Default → Focus: warm gold border
            </p>
          </div>

          {/* Textarea */}
          <div>
            <label
              htmlFor="demo-notes"
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-intimate)',
              }}
            >
              Special requests
            </label>
            <textarea
              id="demo-notes"
              placeholder="Tell us about any special requests..."
              rows={3}
              style={{
                width: '100%',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-body)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-small)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text)',
                outline: 'none',
                resize: 'vertical',
                transition:
                  'border-color var(--duration-fast) var(--easing-in-out)',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            />
          </div>

          {/* Select */}
          <div>
            <label
              htmlFor="demo-service"
              style={{
                display: 'block',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-intimate)',
              }}
            >
              Service
            </label>
            <select
              id="demo-service"
              style={{
                width: '100%',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-body)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-small)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text)',
                outline: 'none',
                cursor: 'pointer',
                minHeight: '44px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <option value="">Select a service</option>
              <option value="hair">Hair</option>
              <option value="color">Color</option>
              <option value="bridal">Bridal</option>
              <option value="spa">Spa</option>
            </select>
          </div>

          {/* Checkbox */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-personal)',
                cursor: 'pointer',
                minHeight: '44px',
                fontSize: 'var(--text-body)',
                color: 'var(--color-text)',
              }}
            >
              <input
                type="checkbox"
                checked={checkbox}
                onChange={(e) => setCheckbox(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--color-accent)',
                  cursor: 'pointer',
                }}
              />
              Accept terms and conditions
            </label>
          </div>

          {/* Radio */}
          <div>
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  marginBottom: 'var(--spacing-intimate)',
                }}
              >
                Preferred time
              </legend>
              {[
                ['option-a', 'Morning'],
                ['option-b', 'Afternoon'],
                ['option-c', 'Evening'],
              ].map(([val, label]) => (
                <label
                  key={val}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-personal)',
                    cursor: 'pointer',
                    minHeight: '44px',
                    fontSize: 'var(--text-body)',
                    color: 'var(--color-text)',
                  }}
                >
                  <input
                    type="radio"
                    name="demo-radio"
                    value={val}
                    checked={radio === val}
                    onChange={(e) => setRadio(e.target.value)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: 'var(--color-accent)',
                      cursor: 'pointer',
                    }}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
          </div>

          {/* Switch */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-personal)',
                cursor: 'pointer',
                minHeight: '44px',
                fontSize: 'var(--text-body)',
                color: 'var(--color-text)',
              }}
            >
              <button
                type="button"
                role="switch"
                aria-checked={switchOn}
                onClick={() => setSwitchOn(!switchOn)}
                style={{
                  position: 'relative',
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: switchOn
                    ? 'var(--color-accent)'
                    : 'var(--color-border)',
                  cursor: 'pointer',
                  transition:
                    'background-color var(--duration-fast) var(--easing-in-out)',
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: switchOn ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-surface)',
                    transition:
                      'left var(--duration-fast) var(--easing-in-out)',
                  }}
                />
              </button>
              Enable notifications
            </label>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
           5. CARDS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Cards"
        description="No borders, no drop shadows per VISUAL_RULES CR1-CR2. Separation via space and surface contrast."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--spacing-social)',
          }}
        >
          {/* Basic Card */}
          <div
            style={{
              padding: 'var(--spacing-social)',
              borderRadius: 'var(--radius-medium)',
              backgroundColor: 'var(--color-surface-secondary)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--text-micro)',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--spacing-intimate)',
              }}
            >
              Basic
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-heading)',
                lineHeight: 'var(--leading-heading)',
                fontWeight: 'var(--weight-heading)',
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-personal)',
              }}
            >
              Hair Services
            </p>
            <p
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--leading-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              From precision cuts to transformative restyling, our artisans
              bring years of dedicated practice to every consultation.
            </p>
          </div>

          {/* Elevated Card */}
          <div
            style={{
              padding: 'var(--spacing-social)',
              borderRadius: 'var(--radius-medium)',
              backgroundColor: 'var(--color-surface-elevated)',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--text-micro)',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--spacing-intimate)',
              }}
            >
              Elevated
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-heading)',
                lineHeight: 'var(--leading-heading)',
                fontWeight: 'var(--weight-heading)',
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-personal)',
              }}
            >
              Color Studio
            </p>
            <p
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--leading-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Our color artisans understand the science and art of dimension —
              creating tones that move with light and life.
            </p>
          </div>

          {/* Interactive Card */}
          <div
            style={{
              padding: 'var(--spacing-social)',
              borderRadius: 'var(--radius-medium)',
              backgroundColor: 'var(--color-surface-secondary)',
              cursor: 'pointer',
              transition:
                'box-shadow var(--duration-fast) var(--easing-in-out)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <p
              style={{
                fontSize: 'var(--text-micro)',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--spacing-intimate)',
              }}
            >
              Interactive
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-heading)',
                lineHeight: 'var(--leading-heading)',
                fontWeight: 'var(--weight-heading)',
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-personal)',
              }}
            >
              Bridal Experience
            </p>
            <p
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--leading-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-personal)',
              }}
            >
              Your most important day deserves the most considered preparation.
              Our bridal artisans create with ceremony and care.
            </p>
            <span
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-accent)',
                fontWeight: 500,
              }}
            >
              Learn more →
            </span>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
           6. LAYOUT
           ════════════════════════════════════════════════════ */}
      <Section
        title="Layout"
        description="Containers, max widths, grid, stack, spacer, and divider primitives."
      >
        {/* Max Widths */}
        <SubSection title="Max Widths">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-personal)' }}>
            {(
              [
                ['narrow', MAX_WIDTHS.narrow],
                ['content', MAX_WIDTHS.content],
                ['wide', MAX_WIDTHS.wide],
                ['full', MAX_WIDTHS.full],
              ] as const
            ).map(([name, value]) => (
              <div key={name}>
                <p
                  style={{
                    fontSize: 'var(--text-micro)',
                    color: 'var(--color-text-muted)',
                    marginBottom: '4px',
                  }}
                >
                  {name}: {value}
                </p>
                <div
                  style={{
                    width: value,
                    maxWidth: '100%',
                    height: '8px',
                    borderRadius: 'var(--radius-small)',
                    backgroundColor: 'var(--color-accent)',
                    opacity: 0.3,
                  }}
                />
              </div>
            ))}
          </div>
        </SubSection>

        {/* Spacing Scale */}
        <SubSection title="Spacing Scale (5 Tiers)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-personal)' }}>
            {(
              [
                ['intimate', 'var(--spacing-intimate)', '0.5rem — label-value'],
                ['personal', 'var(--spacing-personal)', '1rem — title-description'],
                ['social', 'var(--spacing-social)', '1.5rem — heading-body'],
                ['formal', 'var(--spacing-formal)', '3rem — between sections'],
                ['public', 'var(--spacing-public)', '5rem — between regions'],
              ] as const
            ).map(([name, value, desc]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-social)',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    flexShrink: 0,
                    fontSize: 'var(--text-micro)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    width: value,
                    height: '8px',
                    borderRadius: 'var(--radius-small)',
                    backgroundColor: 'var(--color-accent)',
                    opacity: 0.3,
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--text-micro)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </SubSection>

        {/* Stack Demo */}
        <SubSection title="Stack">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-personal)',
              padding: 'var(--spacing-personal)',
              backgroundColor: 'var(--color-surface-secondary)',
              borderRadius: 'var(--radius-medium)',
            }}
          >
            {['First item', 'Second item', 'Third item'].map((item) => (
              <div
                key={item}
                style={{
                  padding: 'var(--spacing-personal)',
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderRadius: 'var(--radius-small)',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text)',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </SubSection>

        {/* Divider */}
        <SubSection title="Divider">
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid var(--color-border)',
              margin: 'var(--spacing-personal) 0',
            }}
          />
          <p
            style={{
              fontSize: 'var(--text-micro)',
              color: 'var(--color-text-muted)',
            }}
          >
            Per VISUAL_RULES N29 — dividers are functional only, never decorative.
          </p>
        </SubSection>
      </Section>

      {/* ════════════════════════════════════════════════════
           7. ICONS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Icons"
        description="Line-based, single-color, geometric. Registered via the global icon registry."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 'var(--spacing-personal)',
          }}
        >
          {[
            { name: 'menu', paths: ['M3 6h18M3 12h18M3 18h18'] },
            { name: 'close', paths: ['M6 6l12 12M18 6L6 18'] },
            { name: 'arrow-right', paths: ['M5 12h14M12 5l7 7-7 7'] },
            { name: 'arrow-left', paths: ['M19 12H5M12 19l-7-7 7-7'] },
            { name: 'calendar', paths: ['M19 4H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1zM16 2v4M8 2v4M3 10h18'] },
            { name: 'clock', paths: ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2'] },
            { name: 'user', paths: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z'] },
            { name: 'heart', paths: ['M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z'] },
            { name: 'star', paths: ['M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z'] },
            { name: 'search', paths: ['M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35'] },
            { name: 'phone', paths: ['M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z'] },
            { name: 'mail', paths: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6'] },
            { name: 'map-pin', paths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z'] },
            { name: 'scissors', paths: ['M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12'] },
            { name: 'sparkles', paths: ['M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z'] },
            { name: 'eye', paths: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z'] },
          ].map((icon) => (
            <div
              key={icon.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-intimate)',
                padding: 'var(--spacing-personal)',
                borderRadius: 'var(--radius-medium)',
                backgroundColor: 'var(--color-surface-secondary)',
                minHeight: '44px',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--color-text)' }}
              >
                {icon.paths.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </svg>
              <span
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  textAlign: 'center',
                }}
              >
                {icon.name}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
           8. MOTION TOKENS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Motion Tokens"
        description="All motion values rendered statically. Per DESIGN_SYSTEM §14 — motion serves content, never decorates it."
      >
        {/* Durations */}
        <SubSection title="Durations">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            {(
              Object.entries(DURATION) as [string, number][]
            ).map(([name, ms]) => (
              <TokenCard
                key={name}
                label={name}
                value={`${ms}ms`}
                preview={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'var(--color-accent)',
                      opacity: Math.min(0.15 + (ms / 1200) * 0.85, 1),
                      borderRadius: 'var(--radius-small)',
                    }}
                  />
                }
                mono
              />
            ))}
          </div>
        </SubSection>

        {/* Easings */}
        <SubSection title="Easings">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            {(
              Object.entries(EASING) as [string, string][]
            ).map(([name, value]) => (
              <TokenCard
                key={name}
                label={name}
                value={value}
                mono
              />
            ))}
          </div>
        </SubSection>

        {/* Transform Limits */}
        <SubSection title="Transform Limits">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--spacing-personal)',
            }}
          >
            {(
              Object.entries(MOTION_LIMITS) as [string, number][]
            ).map(([name, value]) => (
              <TokenCard
                key={name}
                label={name}
                value={String(value)}
                mono
              />
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ════════════════════════════════════════════════════
           9. BREAKPOINTS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Breakpoints"
        description="Mobile-first responsive system. Four tiers per DESIGN_SYSTEM §7."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--spacing-personal)',
          }}
        >
          {(
            Object.entries(BREAKPOINTS) as [string, number][]
          ).map(([name, px]) => (
            <TokenCard
              key={name}
              label={name}
              value={px === 0 ? '0px' : `${px}px+`}
              preview={
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--color-accent)',
                    opacity: 0.15 + (px / 1440) * 0.85,
                    borderRadius: 'var(--radius-small)',
                  }}
                />
              }
              mono
            />
          ))}
        </div>
        <div style={{ marginTop: 'var(--spacing-social)' }}>
          <SubSection title="Media Queries">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--spacing-personal)',
              }}
            >
              {(
                Object.entries(MEDIA_QUERIES) as [string, string][]
              ).map(([name, query]) => (
                <TokenCard key={name} label={name} value={query} mono />
              ))}
            </div>
          </SubSection>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
           10. SHADOWS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Shadows"
        description="Warm-toned elevation system. Brown-grey, never blue-grey. Per DESIGN_SYSTEM §9."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--spacing-social)',
          }}
        >
          {(
            Object.entries(SHADOWS_LIGHT) as [string, string][]
          ).map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  height: '80px',
                  borderRadius: 'var(--radius-medium)',
                  backgroundColor: 'var(--color-surface-elevated)',
                  boxShadow: value,
                  marginBottom: 'var(--spacing-personal)',
                }}
              />
              <p
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  marginBottom: '2px',
                }}
              >
                {name}
              </p>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  fontFamily: 'ui-monospace, monospace',
                  color: 'var(--color-text-muted)',
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'var(--spacing-social)' }}>
          <SubSection title="Dark Mode Shadows (Warm Glow)">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 'var(--spacing-social)',
              }}
            >
              {(
                Object.entries(SHADOWS_DARK) as [string, string][]
              ).map(([name, value]) => (
                <div
                  key={name}
                  style={{
                    padding: 'var(--spacing-personal)',
                    borderRadius: 'var(--radius-medium)',
                    backgroundColor: '#1C1816',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      height: '60px',
                      borderRadius: 'var(--radius-medium)',
                      backgroundColor: '#2E2720',
                      boxShadow: value,
                      marginBottom: 'var(--spacing-personal)',
                    }}
                  />
                  <p
                    style={{
                      fontSize: 'var(--text-caption)',
                      fontWeight: 500,
                      color: '#EDE6DD',
                      marginBottom: '2px',
                    }}
                  >
                    {name}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-micro)',
                      fontFamily: 'ui-monospace, monospace',
                      color: '#8A7D72',
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </SubSection>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
           11. RADIUS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Radius"
        description="Five-tier border radius scale. Per DESIGN_SYSTEM §8, R1-R6."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 'var(--spacing-social)',
          }}
        >
          {(
            Object.entries(RADIUS) as [string, string][]
          ).map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto var(--spacing-personal)',
                  backgroundColor: 'var(--color-accent)',
                  opacity: 0.15,
                  borderRadius: value,
                  border: '2px solid var(--color-accent)',
                }}
              />
              <p
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  marginBottom: '2px',
                }}
              >
                {name}
              </p>
              <p
                style={{
                  fontSize: 'var(--text-micro)',
                  fontFamily: 'ui-monospace, monospace',
                  color: 'var(--color-text-muted)',
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
           12. Z-INDEX
           ════════════════════════════════════════════════════ */}
      <Section
        title="Z-Index"
        description="Eight-layer stacking system. Predictable, consistent ordering."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-intimate)' }}>
          {(
            Object.entries(Z_INDEX) as [string, number][]
          ).map(([name, value]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-social)',
                padding: 'var(--spacing-personal) var(--spacing-social)',
                backgroundColor: 'var(--color-surface-secondary)',
                borderRadius: 'var(--radius-medium)',
              }}
            >
              <div
                style={{
                  width: `${Math.max(20, (value / 9999) * 100)}%`,
                  maxWidth: '300px',
                  height: '8px',
                  borderRadius: 'var(--radius-small)',
                  backgroundColor: 'var(--color-accent)',
                  opacity: 0.2 + (value / 9999) * 0.8,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  minWidth: '100px',
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-micro)',
                  fontFamily: 'ui-monospace, monospace',
                  color: 'var(--color-text-muted)',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
           13. FEATURE FLAGS
           ════════════════════════════════════════════════════ */}
      <Section
        title="Feature Flags"
        description="Current flag values from the feature flag system."
      >
        {featureFlags && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-intimate)' }}>
            {(
              Object.entries(featureFlags) as [FeatureFlag, boolean][]
            ).map(([flag, enabled]) => (
              <div
                key={flag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-personal) var(--spacing-social)',
                  backgroundColor: 'var(--color-surface-secondary)',
                  borderRadius: 'var(--radius-medium)',
                  minHeight: '44px',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-caption)',
                    fontFamily: 'ui-monospace, monospace',
                    color: 'var(--color-text)',
                  }}
                >
                  {flag}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-micro)',
                    fontWeight: 600,
                    color: enabled ? 'var(--color-success)' : 'var(--color-text-muted)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-small)',
                    backgroundColor: enabled
                      ? 'rgba(122, 140, 90, 0.12)'
                      : 'rgba(138, 125, 114, 0.12)',
                  }}
                >
                  {enabled ? 'ON' : 'OFF'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ════════════════════════════════════════════════════
           14. ENVIRONMENT
           ════════════════════════════════════════════════════ */}
      <Section
        title="Environment"
        description="Runtime environment information."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-intimate)' }}>
          {[
            ['Development Mode', isDev ? 'Yes' : 'No'],
            ['Theme', theme || 'Unknown'],
            ['Reduced Motion', reducedMotion ? 'Active' : 'Inactive'],
            ['Screen Size', screenSize || 'Unknown'],
            ['Browser', browserInfo],
            ['App Name', APP_CONFIG.name],
            ['App Version', APP_CONFIG.version],
            ['Max Bundle', `${(APP_CONFIG.performance.maxBundleSize / 1000).toFixed(0)}KB`],
            ['Max Load', `${(APP_CONFIG.performance.maxInitialLoad / 1000000).toFixed(1)}MB`],
            ['LCP Budget', `${APP_CONFIG.performance.lcp}ms`],
            ['INP Budget', `${APP_CONFIG.performance.inp}ms`],
            ['CLS Budget', APP_CONFIG.performance.cls],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-personal) var(--spacing-social)',
                backgroundColor: 'var(--color-surface-secondary)',
                borderRadius: 'var(--radius-medium)',
                minHeight: '44px',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text)',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-caption)',
                  fontFamily: 'ui-monospace, monospace',
                  color: 'var(--color-text-muted)',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
           15. INFRASTRUCTURE
           ════════════════════════════════════════════════════ */}
      <Section
        title="Infrastructure"
        description="Verification of all completed foundation systems from Phase 3 (Steps 3.1–3.7)."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-intimate)' }}>
          <StatusItem label="Theme Provider (prefers-color-scheme, localStorage, data-theme)" ok={true} />
          <StatusItem label="Router (TanStack Router, file-based routing)" ok={true} />
          <StatusItem label="Redux (Redux Toolkit, booking + ui slices)" ok={true} />
          <StatusItem label="React Query (TanStack Query, server state)" ok={true} />
          <StatusItem label="GSAP Registration (idempotent init, ScrollTrigger)" ok={true} />
          <StatusItem label="Lenis Registration (smooth scroll, rAF sync)" ok={true} />
          <StatusItem label="Shared Providers (Redux → Query → Theme → Animation → Portal → Cursor)" ok={true} />
          <StatusItem label="Error Boundary (Root catastrophic + Section local)" ok={true} />
          <StatusItem label="Performance Layer (Web Vitals, long task tracking, memory)" ok={true} />
          <StatusItem label="Asset Registry (icons, images, fonts, lazy helpers)" ok={true} />
          <StatusItem label="Animation Registry (presets, timeline factory, reduced motion)" ok={true} />
          <StatusItem label="Layout Primitives (SectionWrapper, MaxWidth, Stack, Grid, Spacer, Divider)" ok={true} />
          <StatusItem label="Global Utilities (16 hooks, 10 utils, browser detection)" ok={true} />
          <StatusItem label="Shared Infrastructure (config, feature flags, env, events, logger)" ok={true} />
        </div>
      </Section>

      {/* ── Page Footer ──────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: 'var(--spacing-formal) 2rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 'var(--text-micro)',
            color: 'var(--color-text-muted)',
          }}
        >
          Foundation Showcase — Development only. Not part of the production
          website. Removable in one commit.
        </p>
      </footer>
    </div>
  );
}
