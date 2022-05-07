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
            white: "#FEFEFE",
            black: "#111111",
            purple: {
                faded: "#3d29730d",
                accent: "#8258F4",
                secondary: "#3D2973",
                DEFAULT: "#B6A0F2",
            },
            gray: {
                DEFAULT: "#D7D7D7",
                background: "#11111138",
            },
            red: {
                DEFAULT: "#F45858",
            },
        },
    },
    plugins: [],
};