import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawcation 🐾",
  description: "Pet Hotel Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
