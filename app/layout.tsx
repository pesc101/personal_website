import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";

export const metadata: Metadata = {
    title: "Jan Strich – AI Researcher",
    description: "Personal website of Jan Strich, AI Researcher",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
