import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediTrace AI",
  description: "Health information exploration with clear uncertainty and privacy-first design.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
