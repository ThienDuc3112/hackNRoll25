/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "float-1": "float1 20s infinite",
        "float-2": "float2 18s infinite",
        "float-3": "float3 22s infinite",
        "float-4": "float4 25s infinite",
        "float-5": "float5 23s infinite",
        "float-6": "float6 21s infinite",
      },
      keyframes: {
        float1: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(40px, 40px)" },
        },
        float2: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-30px, 30px)" },
        },
        float3: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(35px, -35px)" },
        },
        float4: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-25px, -25px)" },
        },
        float5: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(30px, -30px)" },
        },
        float6: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-20px, 20px)" },
        },
      },
    },
  },
  plugins: [],
};
