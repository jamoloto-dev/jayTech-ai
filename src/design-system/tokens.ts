/**
 * JayTech AI Design System Tokens
 * Enforces Zero-Pill discipline, dark-mode-first aesthetic, and domain-native video studio ergonomics.
 */

export const designTokens = {
  colors: {
    bg: {
      canvas: '#090A0E',
      surface: '#12141A',
      elevated: '#1A1D26',
      subtle: '#222634',
      border: '#2A2F40',
      borderFocus: '#00F0FF',
    },
    text: {
      primary: '#F0F3F8',
      secondary: '#94A3B8',
      muted: '#64748B',
      accent: '#00F0FF',
      amber: '#FFB800',
      danger: '#EF4444',
      success: '#10B981',
    },
    brand: {
      cyan: '#00F0FF',
      cyanGlow: 'rgba(0, 240, 255, 0.15)',
      amber: '#FFB800',
    },
  },
  typography: {
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  aspectRatios: {
    tiktok: '9 / 16',
    reel: '9 / 16',
    short: '9 / 16',
    square: '1 / 1',
    widescreen: '16 / 9',
  },
} as const;
