/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";

export default {
    content: [
        "./resources/views/app.blade.php",
        "./resources/app/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                xs: "480px",
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};
