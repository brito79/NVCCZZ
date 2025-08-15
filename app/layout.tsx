import type { Metadata } from "next";
import { Poppins, Noto_Sans } from "next/font/google";
import "./globals.css";
import "./theme-blue.css"; // premium blue theme tokens
import type { ReactNode } from "react";
import Layout from "@/components/layout/Layout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-sans", // default app font
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "900"],
  variable: "--font-noto", // optional secondary font
});

export const metadata: Metadata = {
  title: "NVCCZ",
  description: "Financial intelligence and feeds",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${notoSans.variable} theme-blue`}
    >
      <head>
        <meta name="theme-color" content="#0b1220" />
      </head>
      <body className="font-sans antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}