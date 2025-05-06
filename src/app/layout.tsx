import type { Metadata } from "next";
import { Workbench } from "next/font/google";
import "./globals.css";
import ClientLayout from './client-layout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const jacquard12 = Workbench({
  variable: "--font-jacquard12",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ratecard",
  description: "Ratecard for @ekezia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${jacquard12.variable} antialiased`}
      >
          <ClientLayout session={session}>{children}</ClientLayout>
      </body>
    </html>
  );
}
