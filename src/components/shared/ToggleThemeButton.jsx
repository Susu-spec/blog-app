import { IconButton } from "@chakra-ui/react";
import { ColorModeButton, useColorMode } from "../ui/color-mode"
import { HiMoon, HiSun } from "react-icons/hi2";

export default function ToggleThemeButton() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <ColorModeButton
            aria-label="Toggle theme"
            onClick={toggleColorMode}
            variant="ghost"
        >
            {colorMode === "light" ? <HiMoon /> : <HiSun />}
        </ColorModeButton>
    )
}