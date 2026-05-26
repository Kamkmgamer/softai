import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "@uploadthing/react/styles.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SoftAI – AI Ad Video Studio",
    template: "%s – SoftAI",
  },
  description:
    "Turn product briefs, brand assets, and scripts into short-form ad video campaigns. Built for SMB operators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
