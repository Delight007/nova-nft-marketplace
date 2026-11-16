import Navbar from "@/components/navbar";
import AppWalletProvider from "@/components/providers/WalletProvider";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NOVA NFT Marketplace",
    template: "%s | NOVA Marketplace",
  },
  description:
    "Discover, collect, and trade extraordinary NFTs on the Solana blockchain with NOVA Marketplace.",
  applicationName: "NOVA Marketplace",
  openGraph: {
    type: "website",
    siteName: "NOVA Marketplace",
    title: "NOVA NFT Marketplace",
    description:
      "Discover, collect, and trade extraordinary NFTs on the Solana blockchain with NOVA Marketplace.",
  },
  twitter: {
    card: "summary",
    title: "NOVA NFT Marketplace",
    description:
      "Discover, collect, and trade extraordinary NFTs on the Solana blockchain with NOVA Marketplace.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppWalletProvider>
          <QueryProvider>
            <NotificationProvider>
              <Navbar />
              {children}
            </NotificationProvider>
          </QueryProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
