import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "@/trpc/client";

import type { Metadata } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tarefas",
  description: "Gerenciador de tarefas simples com Next.js e tRPC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
