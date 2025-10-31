import { IconButton } from "@chakra-ui/react";
import { ColorModeButton, useColorMode } from "../ui/color-mode"
import { HiMoon, HiSun } from "react-icons/hi2";

/**
 * ToggleThemeButton component — switches between light and dark color modes.
 *
 * Uses Chakra UI's `useColorMode` hook to toggle between themes and display
 * the corresponding icon (sun for light mode, moon for dark mode).
 *
 * Used in the app header to let users
 * change the app’s visual theme.
 *
 * @component
 * @example
 * return (
 *   <header>
 *     <ToggleThemeButton />
 *   </header>
 * )
 *
 * @returns {JSX.Element} A button that toggles the application's color theme.
 */

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