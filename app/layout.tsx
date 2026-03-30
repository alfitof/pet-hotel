import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawcation Dashboard 🐾",
  description: "Pet Hotel Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
