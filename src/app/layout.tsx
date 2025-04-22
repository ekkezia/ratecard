import type { Metadata } from "next";
import { Workbench } from "next/font/google";
import "./globals.css";

const jacquard12 = Workbench({
  variable: "--font-jacquard12",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ratecard",
  description: "Ratecard for @ekezia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jacquard12.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
