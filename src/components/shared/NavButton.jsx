/**
 * @file NavButton.jsx
 * @description
 * Reusable navigation button that handles active state styling based on the current URL and supports
 * conditional rendering logic for dynamic navigation menus.
 */

import { Button } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router";

/**
 * NavButton component
 *
 * This component renders a Chakra `Button` that navigates to a given route when clicked.
 * It automatically detects if the current path matches the `to` prop and applies
 * active styles accordingly.  
 * It can optionally be conditionally hidden using the `condition` prop.
 *
 * @component
 * @example
 * // Example: A navigation button that highlights when active
 * <NavButton to="/my-posts" label="Your Posts" />
 *
 * // Example: Conditionally rendered button
 * <NavButton to="/posts" label="Posts" condition={isActive('/posts')} />
 *
 * @param {Object} props - Component props
 * @param {string} props.to - The target route path to navigate to when clicked.
 * @param {string} props.label - The visible text label for the button.
 * @param {boolean} [props.condition=true] - Optional. Whether to render the button or not.
 * @param {string} [props.variant="link"] - Chakra button variant (defaults to link).
 * @param {Object} [props.sx] - Optional Chakra style overrides.
 * @returns {JSX.Element|null} A styled navigation button or null if `condition` is false.
 */

export default function NavButton({
    to,
    label,
    condition = true,
    variant = "link",
    sx,
    ...props
}) {

    const navigate = useNavigate();
    const location = useLocation();

    if (!condition) return null;

    const isActive = 
        to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(to);

    return (
        <Button
            variant={variant}
            height="2rem"
            px=".75rem"
            color={isActive ? "buttonActiveText" : "buttonText"}
            borderRadius=".5rem"
            onClick={() => navigate(to)}
            backgroundColor={isActive ? "buttonBg" : "transparent"}
            _hover={{
                color: "buttonActiveText",
                backgroundColor: "buttonBg",
            }}
            _active={{
                color: "buttonActiveText",
                backgroundColor: "buttonBg",
            }}
            {...sx}
            {...props}
        >
            {label}
        </Button>
    );
}
