import { type ReactNode, createElement, Fragment } from 'react';

/**
 * A component that wraps children with a provider.
 */
type ProviderComponent = React.ComponentType<{ children: ReactNode }>;

/**
 * Configuration for a single provider in a composition stack.
 */
interface ProviderConfig {
  /** Display name used for React DevTools debugging. */
  name: string;
  /** The provider component to wrap children with. */
  provider: ProviderComponent;
  /** Optional props to pass to the provider (excluding children). */
  props?: Record<string, unknown>;
}

/**
 * Composes an array of provider configurations into a single wrapper component.
 * Providers are nested from outermost (index 0) to innermost (last index).
 *
 * @example
 * ```tsx
 * const AppProviders = composeProviders([
 *   { name: 'Redux', provider: ReduxProvider, props: { store } },
 *   { name: 'Query', provider: QueryProvider },
 *   { name: 'Theme', provider: ThemeProvider },
 * ]);
 *
 * <AppProviders>...</AppProviders>
 * ```
 *
 * @param providers - Array of provider configurations, outermost first.
 * @returns A single component that nests all providers.
 */
function composeProviders(providers: ProviderConfig[]): ProviderComponent {
  if (providers.length === 0) {
    return function EmptyProviders({ children }) {
      return createElement(Fragment, null, children);
    };
  }

  const Composed: ProviderComponent = ({ children }) => {
    let result: ReactNode = children;

    // Wrap from innermost to outermost so the first provider in the array
    // ends up as the outermost wrapper in the tree.
    for (let i = providers.length - 1; i >= 0; i--) {
      const { provider: Provider, props, name } = providers[i];
      const wrappedResult = createElement(
        ProviderDevTool,
        { name, children: createElement(Provider, { ...props, children: result } as React.Attributes & { children: ReactNode }) },
      );
      result = wrappedResult;
    }

    return createElement(Fragment, null, result);
  };

  Composed.displayName = `ComposedProviders(${providers.map((p) => p.name).join(' > ')})`;

  return Composed;
}

/**
 * Variadic version of {@link composeProviders}.
 * Accepts provider configurations as individual arguments instead of an array.
 *
 * @example
 * ```tsx
 * const Providers = createProviderStack(
 *   { name: 'Redux', provider: ReduxProvider, props: { store } },
 *   { name: 'Query', provider: QueryProvider },
 * );
 * ```
 *
 * @param providers - Provider configurations passed as individual arguments.
 * @returns A single component that nests all providers.
 */
function createProviderStack(...providers: ProviderConfig[]): ProviderComponent {
  return composeProviders(providers);
}

/**
 * Dev-only wrapper that adds a `data-provider` attribute for React DevTools debugging.
 * In production builds, this is a pass-through with no overhead.
 *
 * @example
 * ```tsx
 * <ProviderDevTool name="ThemeProvider">
 *   <ThemeProvider>{children}</ThemeProvider>
 * </ProviderDevTool>
 * // Renders: <div data-provider="ThemeProvider"><ThemeProvider>...</ThemeProvider></div>
 * ```
 */
const ProviderDevTool: React.ComponentType<{ name: string; children: ReactNode }> =
  import.meta.env.PROD
    ? ({ children }) => createElement(Fragment, null, children)
    : ({ name, children }) =>
        createElement(
          'div',
          { 'data-provider': name, style: { display: 'contents' } },
          children,
        );

if (!import.meta.env.PROD) {
  ProviderDevTool.displayName = 'ProviderDevTool';
}

export type { ProviderComponent, ProviderConfig };
export { composeProviders, createProviderStack, ProviderDevTool };
