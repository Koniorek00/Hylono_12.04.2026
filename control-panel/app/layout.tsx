import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hylono Control Panel",
  description: "Hylono Stack Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}