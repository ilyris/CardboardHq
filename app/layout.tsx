import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import ThemeProvider from "./components/ThemeProvider";
import { theme } from "./theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SessionProviderWrapper } from "./components/SessionProviderWrapper";
import { auth } from "@/auth";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CardboardHq",
  description: "FaB Card Pricing Provider",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }

  return (
    <html lang="en">
      <StoreProvider>
        <body className={inter.className}>
          <SessionProviderWrapper>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <Navigation isUserLoggedIn={!!session} />
                {children}
              </ThemeProvider>
            </AppRouterCacheProvider>
          </SessionProviderWrapper>
        </body>
      </StoreProvider>
    </html>
  );
}
