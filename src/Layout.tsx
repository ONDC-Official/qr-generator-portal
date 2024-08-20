import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react";
import { darkTheme, lightTheme } from "./assets/themes";
type LayoutProps = {
	children: React.ReactNode;
	theme: "light" | "dark";
};

export const Layout = ({ children, theme }: LayoutProps) => {
	return (
		<ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};
