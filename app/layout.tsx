// app/layout.tsx

import { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Roboto } from '@next/font/google';

// Import the Roboto font and specify the styles (e.g., weights) you need
const roboto = Roboto({
  weight: ['400', '500', '700'], // You can customize weights
  subsets: ['latin'],  // Ensure you include the correct subset
});

export const metadata: Metadata = {
  title: "Shopping App",
  description: "A minimal shopping app built with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`h-full ${roboto.className}`}>
        {children}
      </body>
    </html>
  );
}
