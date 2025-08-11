import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        bodyText: {
          value: { base: "#08090A", _dark: "#f7f8f8" },
        },
        bodyBg: {
          value: { base: "#f7f8f8", _dark: "#08090A" },
        },
        buttonText: {
          value: { base: "#08090A", _dark: "#f7f8f8" },
        },
        buttonActiveText: {
          value: { base: "#f7f8f8", _dark: "#8a8f98" },
        },
        buttonBg: {
          value: { base: "#08090A", _dark: "#ffffff14" },
        },
        navBg: {
          value: { base: "#fffc", _dark: "#0a0a0a" },
        },
        navBorderBottom: {
          value: { base: "#eaeaea", _dark: "#333" }, // example fallback values
        },
      },
    },
  },
})

const system = createSystem(defaultConfig, config);

export default system;
