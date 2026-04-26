// /** @type {import('tailwindcss').Config} */
// const config = {
//   content: [
//     './pages/**/*.{js,jsx}',
//     './components/**/*.{js,jsx}',
//     './app/**/*.{js,jsx}',
//   ],
//   theme: {
//     extend: {
//       // --- COLOUR TOKENS ---
//       colors: {
//         // Brand
//         primary: {
//           DEFAULT: '#1B6CA8',    // Main action colour
//           hover:   '#155a8a',
//           light:   '#E8F1FA',
//           dark:    '#0D3F63',
//         },
//         // Surfaces — layered depth like Material You
//         surface: {
//           base:    '#F6F8FA',    // Page background
//           raised:  '#FFFFFF',    // Cards, modals
//           overlay: '#EEF2F7',    // Hover states, subtle backgrounds
//           inverse: '#0F1B26',    // Dark surfaces
//         },
//         // Text
//         content: {
//           primary:   '#0F1B26',  // Headings, primary text
//           secondary: '#4A5568',  // Body text, labels
//           tertiary:  '#8492A6',  // Placeholders, hints
//           inverse:   '#FFFFFF',  // Text on dark surfaces
//           disabled:  '#C0C9D4',  // Disabled state text
//         },
//         // Semantic
//         success: {
//           DEFAULT: '#1A9E6F',
//           light:   '#E6F7F1',
//           dark:    '#0D6B4A',
//         },
//         error: {
//           DEFAULT: '#D94F4F',
//           light:   '#FDECEA',
//           dark:    '#A33333',
//         },
//         warning: {
//           DEFAULT: '#E07B2A',
//           light:   '#FEF3E2',
//         },
//         // Step indicator colours
//         step: {
//           active:    '#1B6CA8',
//           completed: '#1A9E6F',
//           upcoming:  '#C0C9D4',
//         },
//       },

//       // --- TYPOGRAPHY ---
//       fontFamily: {
//         sans:  ['Inter', 'system-ui', 'sans-serif'],
//         mono:  ['JetBrains Mono', 'monospace'],
//       },
//       fontSize: {
//         // Display — hero headings
//         'display-lg': ['3.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
//         'display-md': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
//         'display-sm': ['2rem',    { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
//         // Heading
//         'heading-lg': ['1.5rem',  { lineHeight: '1.3', fontWeight: '600' }],
//         'heading-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
//         'heading-sm': ['1rem',    { lineHeight: '1.5', fontWeight: '600' }],
//         // Body
//         'body-lg':    ['1.125rem', { lineHeight: '1.7' }],
//         'body-md':    ['1rem',     { lineHeight: '1.7' }],
//         'body-sm':    ['0.875rem', { lineHeight: '1.6' }],
//         // Label
//         'label-lg':   ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
//         'label-md':   ['0.8125rem',{ lineHeight: '1.4', fontWeight: '500' }],
//         'label-sm':   ['0.75rem',  { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.04em' }],
//       },

//       // --- SPACING SCALE ---
//       // Based on 4px base unit — consistent rhythm throughout
//       spacing: {
//         '4.5': '1.125rem',
//         '13':  '3.25rem',
//         '15':  '3.75rem',
//         '18':  '4.5rem',
//         '22':  '5.5rem',
//         '26':  '6.5rem',
//         '30':  '7.5rem',
//       },

//       // --- BORDER RADIUS ---
//       borderRadius: {
//         'xs':  '4px',
//         'sm':  '8px',
//         'md':  '12px',
//         'lg':  '16px',
//         'xl':  '24px',
//         '2xl': '32px',
//         'pill':'9999px',
//       },

//       // --- SHADOWS — Material You elevation ---
//       boxShadow: {
//         'xs':   '0 1px 2px rgba(15,27,38,0.06)',
//         'sm':   '0 2px 8px rgba(15,27,38,0.08)',
//         'md':   '0 4px 16px rgba(15,27,38,0.10)',
//         'lg':   '0 8px 32px rgba(15,27,38,0.12)',
//         'xl':   '0 16px 48px rgba(15,27,38,0.16)',
//         'card': '0 2px 8px rgba(15,27,38,0.06), 0 0 0 1px rgba(15,27,38,0.04)',
//         'button':'0 2px 8px rgba(27,108,168,0.25)',
//       },

//       // --- ANIMATION ---
//       transitionTimingFunction: {
//         'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
//         'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
//       },
//       transitionDuration: {
//         '250': '250ms',
//         '350': '350ms',
//       },

//       // --- BREAKPOINTS ---
//       screens: {
//         'xs': '375px',   // Small phones
//         'sm': '640px',   // Large phones
//         'md': '768px',   // Tablets
//         'lg': '1024px',  // Small laptops
//         'xl': '1280px',  // Desktops
//         '2xl':'1536px',  // Large screens
//       },
//     },
//   },
//   plugins: [],
// }

// export default config