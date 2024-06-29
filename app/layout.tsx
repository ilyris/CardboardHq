import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import ThemeProvider from "./components/ThemeProvider";
import { theme } from "./theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SessionProviderWrapper } from "./components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CardboardHq",
  description: "FaB Card Pricing Provider",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <Navigation />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
