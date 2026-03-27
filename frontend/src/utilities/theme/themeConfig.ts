import { colors } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Theme Configuration file to be used in multiple front end ...
// ... microservices applications to maintain consistent theme ...
// ... across all applications. 

const themeConfig = {
    // Light theme
    light: {
        palette: {
            type: "light",
            primary: {
                main: "#52B788", // A fresh green for primary actions
                light: "#82E0AA",
                dark: "#2D8B5D",
                contrastText: "#fff",
            },
            secondary: {
                main: "#2D3A3A", // A dark grey for secondary actions/accents
                light: "#5B6B6B",
                dark: "#001212",
                contrastText: "#fff",
            },
            background: {
                // Background for <body>
                // and <Section color="default">
                default: "#f5f5f5",
                // Background for elevated
                // components (<Card>, etc)
                paper: "#fefefe",
            },
            text: {
                primary: colors.grey["900"],
                secondary: colors.grey["700"],
                disabled: colors.grey["500"],
            },
            divider: alpha(colors.grey[900], 0.2),
            action: {
                active: alpha(colors.grey[900], 0.54),
                hover: alpha(colors.grey[900], 0.04),
                selected: alpha(colors.grey[900], 0.08),
                disabled: alpha(colors.grey[900], 0.26),
                disabledBackground: alpha(colors.grey[900], 0.12),
            },
            contrastThreshold: 3,
            info: {
                main: "#50AAFF",
                contrastText: "#fff",
            }
        },
    },

    // Dark theme
    dark: {
        border: {
            default: "1px solid #333",
            hover: "1px solid #777",
            active: "1px solid #999",
            main: "1px solid rgba(80, 170, 255, 0.8)",
        },
        palette: {
            type: "dark",
            divider: alpha(colors.grey[900], 0.8),
            primary: {
                main: "#82E0AA", // Light green for dark mode primary
                light: "#B2F0CC",
                dark: "#52B788",
                contrastText: "#000",
            },
            secondary: {
                main: "#5B6B6B", // Lighter dark grey for dark mode secondary
                light: "#8A9C9C",
                dark: "#2D3A3A",
                contrastText: "#fff",
            },
            background: {
                default: "#121212", // Darker background
                paper: "#1E1E1E", // Slightly lighter for elevated components
            },
            text: {
                primary: colors.grey["100"],
                secondary: colors.grey["500"],
                disabled: colors.grey["300"],
            },
            button: {
                primary: colors.blueGrey["50"],
                secondary: colors.blueGrey["50"],
                disabled: colors.grey["300"],
            },
            info: {
                main: colors.blue["500"],
                contrastText: colors.grey["100"],
            }

        },
    },

    // Values for both themes
    common: {
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontSize: "3.2em",
                lineHeight: 1.1,
                fontWeight: 700,
            },
            // Add more typography variants as needed
            button: {
                textTransform: "none", // Ensures buttons are not all caps by default
                fontWeight: 600,
            },
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1200,
                xl: 1920,
            },
        },
        // Override component styles
        overrides: {
            // Global styles
            MuiCssBaseline: {
                "@global": {
                    "#root": {
                        // Flex column that is height
                        // of viewport so that footer
                        // can push self to bottom by
                        // with auto margin-top
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        // Prevent child elements from
                        // shrinking when content
                        // is taller than the screen
                        // (quirk of flex parent)
                        "& > *": {
                            flexShrink: 0,
                        },
                    },
                },
            },
        },
    },
};

export { themeConfig };