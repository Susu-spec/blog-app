import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bodyText: {
          value: { base: "#08090A", _dark: "#f7f8f8" },
        },
        bodyBg: {
          value: { base: "#f7f8f8", _dark: "#08090A" },
        },
        buttonText: {
          value: { base: "#8a8f98", _dark: "#8a8f98" },
        },
        buttonActiveText: {
          value: { base: "#0a0a0a", _dark: "#f7f8f8" },
        },
        buttonBg: {
          value: { base: "#ecedee", _dark: "#141516" },
        },
        buttonBorderColor: {
          value: { base: "#e9e8ea", _dark: "#23252a" }
        },
        navBg: {
          value: { base: "#fff", _dark: "#0a0a0a" },
        },
        navBorderBottom: {
          value: { base: "#eaeaea", _dark: "#333" }, // example fallback values
        },
        linkHoverBg: {
          value: { base: "#f7f8f8cc", _dark: "#0a0a0acc"}
        }
      },
    },
  },
})

const system = createSystem(defaultConfig, config);

export default system;
