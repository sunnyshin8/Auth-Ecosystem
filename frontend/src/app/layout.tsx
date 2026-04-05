"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#020617] text-slate-200 min-h-screen">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
