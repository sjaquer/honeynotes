import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // UI fonts - highly legible
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Display font for titles - elegant but readable
        display: ['var(--font-belleza)', 'Georgia', 'serif'],
        // Letter content fonts - handwriting style
        handwriting: ['var(--font-indie)', 'cursive'],
        dancing: ['var(--font-dancing)', 'cursive'],
        pacifico: ['var(--font-pacifico)', 'cursive'],
        caveat: ['var(--font-caveat)', 'cursive'],
        sacramento: ['var(--font-sacramento)', 'cursive'],
        greatvibes: ['var(--font-greatvibes)', 'cursive'],
        shadows: ['var(--font-shadows)', 'cursive'],
        amatic: ['var(--font-amatic)', 'cursive'],
        permanent: ['var(--font-permanent)', 'cursive'],
        satisfy: ['var(--font-satisfy)', 'cursive'],
        kalam: ['var(--font-kalam)', 'cursive'],
        // Additional fonts
        patrick: ['var(--font-patrick)', 'cursive'],
        architects: ['var(--font-architects)', 'cursive'],
        cookie: ['var(--font-cookie)', 'cursive'],
        courgette: ['var(--font-courgette)', 'cursive'],
        lobster: ['var(--font-lobster)', 'cursive'],
        allura: ['var(--font-allura)', 'cursive'],
        tangerine: ['var(--font-tangerine)', 'cursive'],
        alexbrush: ['var(--font-alexbrush)', 'cursive'],
        mrdafoe: ['var(--font-mrdafoe)', 'cursive'],
      },
      boxShadow: {
        // Stylized Crimson shadows - deep and luxurious
        'crimson-soft': '0 10px 30px -5px rgba(220, 20, 60, 0.15)',
        'crimson-deep': '0 25px 50px -12px rgba(220, 20, 60, 0.25)',
        'crimson-glow': '0 0 40px rgba(220, 20, 60, 0.2)',
        'crimson-card': '0 4px 20px -2px rgba(220, 20, 60, 0.12), 0 12px 40px -4px rgba(220, 20, 60, 0.08)',
        'crimson-hover': '0 8px 30px -4px rgba(220, 20, 60, 0.2), 0 16px 50px -8px rgba(220, 20, 60, 0.15)',
        'crimson-pressed': '0 2px 8px -1px rgba(220, 20, 60, 0.1)',
        'honey-glow': '0 0 30px rgba(255, 215, 0, 0.3)',
        'luxury': '0 20px 60px -15px rgba(0, 0, 0, 0.15), 0 10px 30px -10px rgba(220, 20, 60, 0.1)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '3xl': '1.5rem',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
