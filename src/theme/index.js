import { theme, ThemeProvider , CSSReset } from "@chakra-ui/core";
import React from "react";

// Let's say you want to add custom colors
export const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
};

const AppTheme = function({children}){
    return <ThemeProvider theme={customTheme}>
            <CSSReset />
            {children}
           </ThemeProvider>;
}

export default AppTheme