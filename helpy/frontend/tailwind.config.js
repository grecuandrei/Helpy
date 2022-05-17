module.exports = {
    content: ["./src/**/*.{jsx,js}"],
    theme: {
        fontFamily: {
            sans: ["Poppins", "sans-serif"],
        },
        boxShadow: {
            DEFAULT: "0px 1px 2px rgba(0, 0, 0, 0.03)",
        },
        screens: {
            md: "768px",
            lg: "1024px",
            xl: "1280px",
        },
        colors: {
            transparent: "transparent",
            current: "currentColor",
            white: "#FFFAF9",
            black: "#1C1C1C",
            orange: {
                faded: "#1A229A0d",
                accent: "#F89E8F",
                secondary: "#1A229A",
                DEFAULT: "#F9CCBF",
            },
            gray: {
                DEFAULT: "#D2D2D2",
                background: "#1C1C1C38",
            },
            red: {
                DEFAULT: "#F45858",
            },
        },
    },
    plugins: [],
};