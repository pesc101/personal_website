import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
