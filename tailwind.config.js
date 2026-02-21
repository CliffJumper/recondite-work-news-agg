/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Using a semantic approach mapping to standard Tailwind colors
                background: '#f8fafc', // Slate 50
                surface: '#ffffff',
                primary: {
                    DEFAULT: '#2563eb', // Blue 600
                    hover: '#1d4ed8', // Blue 700
                    light: '#eff6ff', // Blue 50
                },
                secondary: '#64748b', // Slate 500
                border: '#e2e8f0', // Slate 200
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'card': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)',
                'card-hover': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 8px 16px rgba(0, 0, 0, 0.08)',
            }
        },
    },
    plugins: [],
}
